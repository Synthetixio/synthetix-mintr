import React, { useContext, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';

import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { addBufferToGasLimit } from '../../../helpers/networkHelper';

import { SliderContext } from '../../../components/ScreenSlider';
import { createTransaction } from '../../../ducks/transactions';
import { getCurrentGasPrice } from '../../../ducks/network';
import { getWalletDetails } from '../../../ducks/wallet';

import { bigNumberFormatter, bytesFormatter, formatCurrency } from '../../../helpers/formatters';

import errorMapper from '../../../helpers/errorMapper';
import { useTranslation } from 'react-i18next';

const useGetWalletSynths = (walletAddress, setBaseSynth) => {
	const [data, setData] = useState(null);
	useEffect(() => {
		const getWalletSynths = async () => {
			try {
				let walletSynths = [];

				const synthList = snxJSConnector.synths
					.filter(({ name, asset }) => {
						return name !== 'sUSD' && asset;
					})
					.map(({ name }) => name);

				const balanceResults = await Promise.all(
					synthList.map(synth => snxJSConnector.snxJS[synth].balanceOf(walletAddress))
				);

				balanceResults.forEach((synthBalance, index) => {
					const balance = bigNumberFormatter(synthBalance);
					if (balance && balance > 0)
						walletSynths.push({
							name: synthList[index],
							rawBalance: synthBalance,
							balance,
						});
				});

				const exchangeRatesResults = await snxJSConnector.snxJS.ExchangeRates.ratesForCurrencies(
					walletSynths.map(({ name }) => bytesFormatter(name))
				);

				walletSynths = walletSynths.map((synth, i) => {
					return {
						...synth,
						rate: bigNumberFormatter(exchangeRatesResults[i]),
					};
				});

				setData(walletSynths);
				setBaseSynth(walletSynths.length > 0 && walletSynths[0]);
			} catch (e) {
				console.log(e);
			}
		};
		getWalletSynths();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [walletAddress]);
	return data;
};

const useGetGasEstimate = (
	baseSynth,
	baseAmount,
	currentWallet,
	waitingPeriod,
	setFetchingGasLimit,
	setGasLimit
) => {
	const [error, setError] = useState(null);
	const { t } = useTranslation();
	useEffect(() => {
		if (!baseSynth || baseAmount <= 0) return;
		const getGasEstimate = async () => {
			setError(null);
			let gasEstimate;
			try {
				setFetchingGasLimit(true);
				if (!Number(baseAmount)) throw new Error('input.error.invalidAmount');
				if (waitingPeriod) throw new Error(`Waiting period for ${baseSynth.name} is still ongoing`);
				const amountToExchange =
					baseAmount === baseSynth.balance
						? baseSynth.rawBalance
						: snxJSConnector.utils.parseEther(baseAmount.toString());
				gasEstimate = await snxJSConnector.snxJS.Synthetix.contract.estimateGas.exchange(
					bytesFormatter(baseSynth.name),
					amountToExchange,
					bytesFormatter('sUSD')
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
	}, [baseSynth, baseAmount, currentWallet, waitingPeriod]);
	return error;
};

const Trade = ({ onDestroy, walletDetails, createTransaction, currentGasPrice }) => {
	const { handleNext, handlePrev } = useContext(SliderContext);
	const [baseSynth, setBaseSynth] = useState(null);
	const [baseAmount, setBaseAmount] = useState('');
	const [quoteAmount, setQuoteAmount] = useState('');
	const [feeRate, setFeeRate] = useState(0);
	const [waitingPeriod, setWaitingPeriod] = useState(0);
	const [transactionInfo, setTransactionInfo] = useState({});
	const { currentWallet, walletType, networkName } = walletDetails;
	const [isFetchingGasLimit, setFetchingGasLimit] = useState(false);
	const [gasLimit, setGasLimit] = useState(0);

	const synthBalances = useGetWalletSynths(currentWallet, setBaseSynth);
	const gasEstimateError = useGetGasEstimate(
		baseSynth,
		baseAmount,
		currentWallet,
		waitingPeriod,
		setFetchingGasLimit,
		setGasLimit
	);

	const getMaxSecsLeftInWaitingPeriod = useCallback(async () => {
		if (!baseSynth || !baseAmount) return;
		try {
			const maxSecsLeftInWaitingPeriod = await snxJSConnector.snxJS.Exchanger.maxSecsLeftInWaitingPeriod(
				currentWallet,
				bytesFormatter(baseSynth.name)
			);
			setWaitingPeriod(Number(maxSecsLeftInWaitingPeriod));
		} catch (e) {
			console.log(e);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [baseSynth, baseAmount]);

	useEffect(() => {
		getMaxSecsLeftInWaitingPeriod();
	}, [getMaxSecsLeftInWaitingPeriod]);

	useEffect(() => {
		const getFeeRateForExchange = async () => {
			if (!baseSynth) return;
			try {
				const {
					snxJS: { Exchanger },
				} = snxJSConnector;
				const feeRateForExchange = await Exchanger.feeRateForExchange(
					bytesFormatter(baseSynth.name),
					bytesFormatter('sUSD')
				);
				setFeeRate(100 * bigNumberFormatter(feeRateForExchange));
			} catch (e) {
				console.log(e);
			}
		};
		getFeeRateForExchange();
	}, [baseSynth]);

	const onTrade = async () => {
		try {
			const amountToExchange =
				baseAmount === baseSynth.balance
					? baseSynth.rawBalance
					: snxJSConnector.utils.parseEther(baseAmount.toString());
			handleNext(1);
			const transaction = await snxJSConnector.snxJS.Synthetix.exchange(
				bytesFormatter(baseSynth.name),
				amountToExchange,
				bytesFormatter('sUSD'),
				{
					gasPrice: currentGasPrice.formattedPrice,
					gasLimit,
				}
			);
			if (transaction) {
				setTransactionInfo({ transactionHash: transaction.hash });
				createTransaction({
					hash: transaction.hash,
					status: 'pending',
					info: `Exchanging ${formatCurrency(baseAmount, 3)} ${baseSynth.name} to ${formatCurrency(
						quoteAmount,
						3
					)} sUSD`,
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
		synthBalances,
		baseSynth,
		onTrade,
		baseAmount,
		quoteAmount,
		setBaseAmount,
		setQuoteAmount,
		walletType,
		networkName,
		goBack: handlePrev,
		...transactionInfo,
		onBaseSynthChange: synth => setBaseSynth(synth),
		isFetchingGasLimit,
		gasLimit,
		gasEstimateError,
		waitingPeriod,
		onWaitingPeriodCheck: () => getMaxSecsLeftInWaitingPeriod(),
		feeRate,
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

export default connect(mapStateToProps, mapDispatchToProps)(Trade);
