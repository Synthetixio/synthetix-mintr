import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { SliderContext } from '../../../components/ScreenSlider';
import { Store } from '../../../store';
import { bytesFormatter, bigNumberFormatter, formatCurrency } from '../../../helpers/formatters';

import errorMapper from '../../../helpers/errorMapper';
import { createTransaction } from '../../../ducks/transactions';
import { updateGasLimit, fetchingGasLimit } from '../../../ducks/network';

import { GWEI_UNIT } from '../../../helpers/networkHelper';

const useGetIssuanceData = (walletAddress, sUSDBytes) => {
	const [data, setData] = useState({});
	const SNXBytes = bytesFormatter('SNX');
	useEffect(() => {
		const getIssuanceData = async () => {
			try {
				const results = await Promise.all([
					snxJSConnector.snxJS.Synthetix.maxIssuableSynths(walletAddress, sUSDBytes),
					snxJSConnector.snxJS.Synthetix.debtBalanceOf(walletAddress, sUSDBytes),
					snxJSConnector.snxJS.SynthetixState.issuanceRatio(),
					snxJSConnector.snxJS.ExchangeRates.rateForCurrency(SNXBytes),
				]);
				const [maxIssuableSynths, debtBalance, issuanceRatio, SNXPrice] = results.map(
					bigNumberFormatter
				);
				const issuableSynths = Math.max(0, maxIssuableSynths - debtBalance);
				setData({ issuableSynths, debtBalance, issuanceRatio, SNXPrice });
			} catch (e) {
				console.log(e);
			}
		};
		getIssuanceData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [walletAddress]);
	return data;
};

const useGetGasEstimate = (mintAmount, issuableSynths) => {
	const { t } = useTranslation();
	const { dispatch } = useContext(Store);
	const [error, setError] = useState(null);
	useEffect(() => {
		const sUSDBytes = bytesFormatter('sUSD');
		if (!mintAmount) return;
		const getGasEstimate = async () => {
			setError(null);
			fetchingGasLimit(dispatch);
			let gasEstimate;
			try {
				if (!parseFloat(mintAmount)) throw new Error('input.error.invalidAmount');
				if (mintAmount <= 0 || mintAmount > issuableSynths)
					throw new Error('input.error.notEnoughSusd');
				if (mintAmount === issuableSynths) {
					gasEstimate = await snxJSConnector.snxJS.Synthetix.contract.estimate.issueMaxSynths(
						sUSDBytes
					);
				} else {
					gasEstimate = await snxJSConnector.snxJS.Synthetix.contract.estimate.issueSynths(
						sUSDBytes,
						snxJSConnector.utils.parseEther(mintAmount.toString())
					);
				}
				updateGasLimit(Number(gasEstimate), dispatch);
			} catch (e) {
				console.log(e);
				const errorMessage = (e && e.message) || 'input.error.gasEstimate';
				setError(t(errorMessage));
			}
			updateGasLimit(Number(gasEstimate), dispatch);
		};
		getGasEstimate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mintAmount]);
	return error;
};

const Mint = ({ onDestroy }) => {
	const { handleNext, handlePrev } = useContext(SliderContext);
	const [mintAmount, setMintAmount] = useState('');
	const [transactionInfo, setTransactionInfo] = useState({});
	const {
		state: {
			wallet: { currentWallet, walletType, networkName },
			network: {
				settings: { gasPrice, gasLimit, isFetchingGasLimit },
			},
		},
		dispatch,
	} = useContext(Store);

	const sUSDBytes = bytesFormatter('sUSD');
	const { issuableSynths, issuanceRatio, SNXPrice } = useGetIssuanceData(currentWallet, sUSDBytes);

	const gasEstimateError = useGetGasEstimate(mintAmount, issuableSynths);

	const onMint = async () => {
		const transactionSettings = {
			gasPrice: gasPrice * GWEI_UNIT,
			gasLimit,
		};
		try {
			handleNext(1);
			let transaction;
			if (mintAmount === issuableSynths) {
				transaction = await snxJSConnector.snxJS.Synthetix.issueMaxSynths(
					sUSDBytes,
					transactionSettings
				);
			} else {
				transaction = await snxJSConnector.snxJS.Synthetix.issueSynths(
					sUSDBytes,
					snxJSConnector.utils.parseEther(mintAmount.toString()),
					transactionSettings
				);
			}
			if (transaction) {
				setTransactionInfo({ transactionHash: transaction.hash });
				createTransaction(
					{
						hash: transaction.hash,
						status: 'pending',
						info: `Minting ${formatCurrency(mintAmount)} sUSD`,
						hasNotification: true,
					},
					dispatch
				);
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
		onMint,
		issuableSynths,
		goBack: handlePrev,
		walletType,
		networkName,
		mintAmount,
		setMintAmount,
		issuanceRatio,
		SNXPrice,
		...transactionInfo,
		isFetchingGasLimit,
		gasEstimateError,
	};

	return [Action, Confirmation, Complete].map((SlideContent, i) => (
		<SlideContent key={i} {...props} />
	));
};

export default Mint;
