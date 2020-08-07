import React, { useContext, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { addBufferToGasLimit } from '../../../helpers/networkHelper';
import { SliderContext } from '../../../components/ScreenSlider';

import errorMapper from '../../../helpers/errorMapper';
import { createTransaction } from 'ducks/transactions';
import { getCurrentGasPrice } from 'ducks/network';
import { getWalletBalancesToArray } from 'ducks/balances';
import { getWalletDetails } from 'ducks/wallet';
import { getDebtStatusData } from 'ducks/debtStatus';
import { shortenAddress, bytesFormatter } from '../../../helpers/formatters';
import { useTranslation } from 'react-i18next';

const useGetGasEstimate = (
	currency,
	amount,
	destination,
	waitingPeriod,
	setFetchingGasLimit,
	setGasLimit
) => {
	const [error, setError] = useState(null);
	const { t } = useTranslation();
	useEffect(() => {
		if (!currency || !currency.name || !amount || !destination) return;
		const getGasEstimate = async () => {
			setError(null);
			let gasEstimate;
			try {
				if (amount > currency.balance) throw new Error('input.error.balanceTooLow');
				if (waitingPeriod) throw new Error(`Waiting period for ${currency.name} is still ongoing`);
				if (!Number(amount)) throw new Error('input.error.invalidAmount');
				const amountBN =
					amount === currency.balance
						? currency.balanceBN
						: snxJSConnector.utils.parseEther(amount.toString());
				setFetchingGasLimit(true);
				if (currency.name === 'SNX') {
					gasEstimate = await snxJSConnector.snxJS.Synthetix.contract.estimate.transfer(
						destination,
						amountBN
					);
				} else if (currency.name === 'ETH') {
					if (amount === currency.balance) throw new Error('input.error.balanceTooLow');
					gasEstimate = await snxJSConnector.provider.estimateGas({
						value: amountBN,
						to: destination,
					});
				} else {
					gasEstimate = await snxJSConnector.snxJS[
						currency.name
					].contract.estimate.transferAndSettle(destination, amountBN);
				}
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
	}, [amount, currency, destination, waitingPeriod]);
	return error;
};

const sendTransaction = (currency, amount, destination, settings) => {
	if (!currency) return null;
	if (currency === 'SNX') {
		return snxJSConnector.snxJS.Synthetix.contract.transfer(destination, amount, settings);
	} else if (currency === 'ETH') {
		return snxJSConnector.signer.sendTransaction({
			value: amount,
			to: destination,
			...settings,
		});
	} else return snxJSConnector.snxJS[currency].transferAndSettle(destination, amount, settings);
};

const Send = ({
	onDestroy,
	walletDetails,
	currentGasPrice,
	createTransaction,
	walletBalances,
	debtStatusData,
}) => {
	const { handleNext, handlePrev } = useContext(SliderContext);
	const [sendAmount, setSendAmount] = useState('');
	const [sendDestination, setSendDestination] = useState('');
	const [currentCurrency, setCurrentCurrency] = useState(null);
	const [transactionInfo, setTransactionInfo] = useState({});
	const [waitingPeriod, setWaitingPeriod] = useState(0);
	const { currentWallet, walletType, networkName } = walletDetails;
	const [isFetchingGasLimit, setFetchingGasLimit] = useState(false);
	const [gasLimit, setGasLimit] = useState(0);

	const gasEstimateError = useGetGasEstimate(
		currentCurrency,
		sendAmount,
		sendDestination,
		waitingPeriod,
		setFetchingGasLimit,
		setGasLimit
	);

	useEffect(() => {
		if (currentCurrency == null && walletBalances && walletBalances.length > 0) {
			setCurrentCurrency(walletBalances ? walletBalances[0] : null);
		}
	}, [walletBalances, currentCurrency]);

	const getMaxSecsLeftInWaitingPeriod = useCallback(async () => {
		if (!currentCurrency) return;
		if (['ETH', 'SNX'].includes(currentCurrency.name)) return;
		try {
			const maxSecsLeftInWaitingPeriod = await snxJSConnector.snxJS.Exchanger.maxSecsLeftInWaitingPeriod(
				currentWallet,
				bytesFormatter(currentCurrency.name)
			);
			setWaitingPeriod(Number(maxSecsLeftInWaitingPeriod));
		} catch (e) {
			console.log(e);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentCurrency, sendAmount]);

	useEffect(() => {
		getMaxSecsLeftInWaitingPeriod();
	}, [getMaxSecsLeftInWaitingPeriod]);

	const handleCurrencyChange = synth => {
		setSendAmount('');
		setCurrentCurrency(synth);
	};

	const onSend = async () => {
		try {
			const realSendAmount =
				sendAmount === currentCurrency.balance
					? currentCurrency.balanceBN
					: snxJSConnector.utils.parseEther(sendAmount.toString());
			handleNext(1);
			const transaction = await sendTransaction(
				currentCurrency.name,
				realSendAmount,
				sendDestination,
				{ gasPrice: currentGasPrice.formattedPrice, gasLimit }
			);
			if (transaction) {
				setTransactionInfo({ transactionHash: transaction.hash });
				createTransaction({
					hash: transaction.hash,
					status: 'pending',
					info: `Sending ${Math.round(sendAmount, 3)} ${currentCurrency.name} to ${shortenAddress(
						sendDestination
					)}`,
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
		onSend,
		sendAmount,
		sendDestination,
		setSendAmount,
		setSendDestination,
		...transactionInfo,
		goBack: handlePrev,
		walletBalances,
		currentCurrency,
		onCurrentCurrencyChange: handleCurrencyChange,
		walletType,
		networkName,
		gasEstimateError,
		isFetchingGasLimit,
		waitingPeriod,
		onWaitingPeriodCheck: () => getMaxSecsLeftInWaitingPeriod(),
		gasLimit,
	};

	return [Action, Confirmation, Complete].map((SlideContent, i) => (
		<SlideContent debtStatusData={debtStatusData} key={i} {...props} />
	));
};

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
	currentGasPrice: getCurrentGasPrice(state),
	walletBalances: getWalletBalancesToArray(state),
	debtStatusData: getDebtStatusData(state),
});

const mapDispatchToProps = {
	createTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Send);
