import React, { useContext, useState, useEffect, useCallback } from 'react';
import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { SliderContext } from '../../../components/ScreenSlider';
import { Store } from '../../../store';

import errorMapper from '../../../helpers/errorMapper';
import { createTransaction } from '../../../ducks/transactions';
import { updateGasLimit, fetchingGasLimit } from '../../../ducks/network';
import { bigNumberFormatter, shortenAddress, bytesFormatter } from '../../../helpers/formatters';
import { GWEI_UNIT } from '../../../helpers/networkHelper';
import { useTranslation } from 'react-i18next';

const useGetBalances = (walletAddress, setCurrentCurrency) => {
	const [data, setData] = useState([]);
	useEffect(() => {
		const getBalances = async () => {
			try {
				const [transferable, ethBalance] = await Promise.all([
					snxJSConnector.snxJS.Synthetix.transferableSynthetix(walletAddress),
					snxJSConnector.provider.getBalance(walletAddress),
				]);
				let walletBalances = [
					{
						name: 'SNX',
						balance: bigNumberFormatter(transferable),
						rawBalance: transferable,
					},
					{
						name: 'ETH',
						balance: bigNumberFormatter(ethBalance),
						rawBalance: ethBalance,
					},
				];

				const synthList = snxJSConnector.synths
					.filter(({ asset }) => asset)
					.map(({ name }) => name);

				const balanceResults = await Promise.all(
					synthList.map(synth => snxJSConnector.snxJS[synth].balanceOf(walletAddress))
				);

				balanceResults.forEach((synthBalance, index) => {
					const balance = bigNumberFormatter(synthBalance);
					if (balance && balance > 0)
						walletBalances.push({
							name: synthList[index],
							rawBalance: synthBalance,
							balance,
						});
				});
				setData(walletBalances);
				setCurrentCurrency(walletBalances[0]);
			} catch (e) {
				console.log(e);
			}
		};
		getBalances();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [walletAddress]);
	return data;
};

const useGetGasEstimate = (currency, amount, destination, waitingPeriod) => {
	const { dispatch } = useContext(Store);
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
				const amountBN = snxJSConnector.utils.parseEther(amount.toString());
				fetchingGasLimit(dispatch);
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
			} catch (e) {
				console.log(e);
				const errorMessage = (e && e.message) || 'input.error.gasEstimate';
				setError(t(errorMessage));
			}
			updateGasLimit(Number(gasEstimate), dispatch);
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

const Send = ({ onDestroy }) => {
	const { handleNext, handlePrev } = useContext(SliderContext);
	const [sendAmount, setSendAmount] = useState('');
	const [sendDestination, setSendDestination] = useState('');
	const [currentCurrency, setCurrentCurrency] = useState(null);
	const [transactionInfo, setTransactionInfo] = useState({});
	const [waitingPeriod, setWaitingPeriod] = useState(0);
	const {
		state: {
			wallet: { currentWallet, walletType, networkName },
			network: {
				settings: { gasPrice, gasLimit, isFetchingGasLimit },
			},
		},
		dispatch,
	} = useContext(Store);

	const balances = useGetBalances(currentWallet, setCurrentCurrency);
	const gasEstimateError = useGetGasEstimate(
		currentCurrency,
		sendAmount,
		sendDestination,
		waitingPeriod
	);

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

	const onSend = async () => {
		try {
			const realSendAmount =
				sendAmount === currentCurrency.balance
					? currentCurrency.rawBalance
					: snxJSConnector.utils.parseEther(sendAmount.toString());
			handleNext(1);
			const transaction = await sendTransaction(
				currentCurrency.name,
				realSendAmount,
				sendDestination,
				{ gasPrice: gasPrice * GWEI_UNIT, gasLimit }
			);
			if (transaction) {
				setTransactionInfo({ transactionHash: transaction.hash });
				createTransaction(
					{
						hash: transaction.hash,
						status: 'pending',
						info: `Sending ${Math.round(sendAmount, 3)} ${currentCurrency.name} to ${shortenAddress(
							sendDestination
						)}`,
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
		onSend,
		sendAmount,
		sendDestination,
		setSendAmount,
		setSendDestination,
		...transactionInfo,
		goBack: handlePrev,
		balances,
		currentCurrency,
		onCurrentCurrencyChange: synth => setCurrentCurrency(synth),
		walletType,
		networkName,
		gasEstimateError,
		isFetchingGasLimit,
		waitingPeriod,
		onWaitingPeriodCheck: () => getMaxSecsLeftInWaitingPeriod(),
	};

	return [Action, Confirmation, Complete].map((SlideContent, i) => (
		<SlideContent key={i} {...props} />
	));
};

export default Send;
