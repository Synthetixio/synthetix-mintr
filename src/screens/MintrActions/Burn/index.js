import React, { useContext, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { addSeconds, differenceInSeconds } from 'date-fns';

import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { addBufferToGasLimit } from '../../../helpers/networkHelper';

import { SliderContext } from '../../../components/ScreenSlider';

import { bytesFormatter, bigNumberFormatter, formatCurrency } from '../../../helpers/formatters';
import errorMapper from '../../../helpers/errorMapper';
import { createTransaction } from '../../../ducks/transactions';
import { getCurrentGasPrice } from '../../../ducks/network';
import { getWalletDetails } from '../../../ducks/wallet';
import { useTranslation } from 'react-i18next';

const useGetDebtData = (walletAddress, sUSDBytes) => {
	const [data, setData] = useState({});
	const SNXBytes = bytesFormatter('SNX');
	useEffect(() => {
		const getDebtData = async () => {
			try {
				const results = await Promise.all([
					snxJSConnector.snxJS.Synthetix.debtBalanceOf(walletAddress, sUSDBytes),
					snxJSConnector.snxJS.sUSD.balanceOf(walletAddress),
					snxJSConnector.snxJS.SystemSettings.issuanceRatio(),
					snxJSConnector.snxJS.ExchangeRates.rateForCurrency(SNXBytes),
					snxJSConnector.snxJS.RewardEscrow.totalEscrowedAccountBalance(walletAddress),
					snxJSConnector.snxJS.SynthetixEscrow.balanceOf(walletAddress),
					snxJSConnector.snxJS.Synthetix.maxIssuableSynths(walletAddress),
				]);
				const [
					debt,
					sUSDBalance,
					issuanceRatio,
					SNXPrice,
					totalRewardEscrow,
					totalTokenSaleEscrow,
					issuableSynths,
				] = results.map(bigNumberFormatter);
				let maxBurnAmount, maxBurnAmountBN;
				if (debt > sUSDBalance) {
					maxBurnAmount = sUSDBalance;
					maxBurnAmountBN = results[1];
				} else {
					maxBurnAmount = debt;
					maxBurnAmountBN = results[0];
				}

				const escrowBalance = totalRewardEscrow + totalTokenSaleEscrow;
				setData({
					issuanceRatio,
					sUSDBalance,
					maxBurnAmount,
					maxBurnAmountBN,
					SNXPrice,
					burnAmountToFixCRatio: Math.max(debt - issuableSynths, 0),
					debtEscrow: Math.max(escrowBalance * SNXPrice * issuanceRatio + debt - issuableSynths, 0),
				});
			} catch (e) {
				console.log(e);
			}
		};
		getDebtData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [walletAddress]);
	return data;
};

const useGetGasEstimate = (
	burnAmount,
	maxBurnAmount,
	maxBurnAmountBN,
	sUSDBalance,
	waitingPeriod,
	issuanceDelay,
	setFetchingGasLimit,
	setGasLimit
) => {
	const [error, setError] = useState(null);
	const { t } = useTranslation();
	useEffect(() => {
		if (!burnAmount) return;
		const getGasEstimate = async () => {
			setError(null);
			let gasEstimate;
			try {
				if (!parseFloat(burnAmount)) throw new Error('input.error.invalidAmount');
				if (waitingPeriod) throw new Error('Waiting period for sUSD is still ongoing');
				if (issuanceDelay) throw new Error('Waiting period to burn is still ongoing');
				if (burnAmount > sUSDBalance || maxBurnAmount === 0)
					throw new Error('input.error.notEnoughToBurn');
				setFetchingGasLimit(true);

				let amountToBurn;
				if (burnAmount && maxBurnAmount) {
					amountToBurn =
						burnAmount === maxBurnAmount
							? maxBurnAmountBN
							: snxJSConnector.utils.parseEther(burnAmount.toString());
				} else amountToBurn = 0;
				gasEstimate = await snxJSConnector.snxJS.Synthetix.contract.estimate.burnSynths(
					amountToBurn
				);
				setGasLimit(addBufferToGasLimit(gasEstimate));
			} catch (e) {
				console.log(e);
				const errorMessage = (e && e.message) || 'input.error.gasEstimate';
				setError(t(errorMessage));
			}
			setFetchingGasLimit(false);
		};
		getGasEstimate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [burnAmount, maxBurnAmount, waitingPeriod, issuanceDelay]);
	return error;
};

const Burn = ({ onDestroy, walletDetails, createTransaction, currentGasPrice }) => {
	const { handleNext, handlePrev } = useContext(SliderContext);
	const [burnAmount, setBurnAmount] = useState('');
	const [transferableAmount, setTransferableAmount] = useState('');
	const [transactionInfo, setTransactionInfo] = useState({});
	const [waitingPeriod, setWaitingPeriod] = useState(0);
	const [issuanceDelay, setIssuanceDelay] = useState(0);
	const { currentWallet, walletType, networkName } = walletDetails;
	const [isFetchingGasLimit, setFetchingGasLimit] = useState(false);
	const [gasLimit, setGasLimit] = useState(0);

	const sUSDBytes = bytesFormatter('sUSD');
	const {
		maxBurnAmount,
		maxBurnAmountBN,
		sUSDBalance,
		issuanceRatio,
		SNXPrice,
		burnAmountToFixCRatio,
		debtEscrow,
	} = useGetDebtData(currentWallet, sUSDBytes);

	const getMaxSecsLeftInWaitingPeriod = useCallback(async () => {
		const {
			snxJS: { Exchanger },
		} = snxJSConnector;
		try {
			const maxSecsLeftInWaitingPeriod = await Exchanger.maxSecsLeftInWaitingPeriod(
				currentWallet,
				bytesFormatter('sUSD')
			);
			setWaitingPeriod(Number(maxSecsLeftInWaitingPeriod));
		} catch (e) {
			console.log(e);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getIssuanceDelay = useCallback(async () => {
		const {
			snxJS: { Issuer },
		} = snxJSConnector;
		try {
			const [canBurnSynths, lastIssueEvent, minimumStakeTime] = await Promise.all([
				Issuer.canBurnSynths(currentWallet),
				Issuer.lastIssueEvent(currentWallet),
				Issuer.minimumStakeTime(),
			]);

			if (Number(lastIssueEvent) && Number(minimumStakeTime)) {
				const burnUnlockDate = addSeconds(Number(lastIssueEvent) * 1000, Number(minimumStakeTime));
				const issuanceDelayInSeconds = differenceInSeconds(burnUnlockDate, new Date());
				setIssuanceDelay(
					issuanceDelayInSeconds > 0 ? issuanceDelayInSeconds : canBurnSynths ? 0 : 1
				);
			}
		} catch (e) {
			console.log(e);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		getMaxSecsLeftInWaitingPeriod();
		getIssuanceDelay();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getMaxSecsLeftInWaitingPeriod, getIssuanceDelay]);

	const gasEstimateError = useGetGasEstimate(
		burnAmount,
		maxBurnAmount,
		maxBurnAmountBN,
		sUSDBalance,
		waitingPeriod,
		issuanceDelay,
		setFetchingGasLimit,
		setGasLimit
	);
	const onBurn = async ({ burnToTarget = false }) => {
		const {
			snxJS: { Synthetix, Issuer },
		} = snxJSConnector;
		try {
			if (await Synthetix.isWaitingPeriod(bytesFormatter('sUSD')))
				throw new Error('Waiting period for sUSD is still ongoing');

			if (!burnToTarget && !(await Issuer.canBurnSynths(currentWallet)))
				throw new Error('Waiting period to burn is still ongoing');

			handleNext(1);
			let transaction;

			if (burnToTarget) {
				const burnToTargetGasLimit = await Synthetix.contract.estimate.burnSynthsToTarget();
				setGasLimit(addBufferToGasLimit(burnToTargetGasLimit));
				transaction = await Synthetix.burnSynthsToTarget({
					gasLimit: addBufferToGasLimit(burnToTargetGasLimit),
					gasPrice: currentGasPrice.formattedPrice,
				});
			} else {
				const amountToBurn =
					burnAmount === maxBurnAmount
						? maxBurnAmountBN
						: snxJSConnector.utils.parseEther(burnAmount.toString());
				transaction = await Synthetix.burnSynths(amountToBurn, {
					gasPrice: currentGasPrice.formattedPrice,
					gasLimit,
				});
			}

			if (transaction) {
				setTransactionInfo({ transactionHash: transaction.hash });
				createTransaction({
					hash: transaction.hash,
					status: 'pending',
					info: `Burning ${formatCurrency(burnToTarget ? burnAmountToFixCRatio : burnAmount)} sUSD`,
					hasNotification: true,
				});
				handleNext(2);
			}
		} catch (e) {
			console.log(e);
			const errorMessage = errorMapper(e, walletType);
			console.log(errorMessage);
			setTransactionInfo({
				...transactionInfo,
				transactionError: errorMessage,
			});
			handleNext(2);
		}
	};

	const props = {
		onDestroy,
		onBurn,
		goBack: handlePrev,
		maxBurnAmount,
		issuanceRatio,
		...transactionInfo,
		burnAmount,
		setBurnAmount: amount => {
			const amountNB = Number(amount);
			setBurnAmount(amount);
			setTransferableAmount(
				amountNB ? Math.max((amountNB - debtEscrow) / issuanceRatio / SNXPrice, 0) : 0
			);
		},
		transferableAmount,
		setTransferableAmount: amount => {
			const amountNB = Number(amount);
			setBurnAmount(amountNB > 0 ? debtEscrow + amountNB * issuanceRatio * SNXPrice : '');
			setTransferableAmount(amount);
		},
		walletType,
		networkName,
		SNXPrice,
		isFetchingGasLimit,
		gasLimit,
		gasEstimateError,
		burnAmountToFixCRatio,
		waitingPeriod,
		issuanceDelay,
		sUSDBalance,
		onWaitingPeriodCheck: getMaxSecsLeftInWaitingPeriod,
		onIssuanceDelayCheck: getIssuanceDelay,
	};

	return [Action, Confirmation, Complete].map((SlideContent, i) => (
		<SlideContent key={i} {...props} />
	));
};

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
	currentGasPrice: getCurrentGasPrice(state),
});

const mapDispatchToProps = {
	createTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Burn);
