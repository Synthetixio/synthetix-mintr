import React, { useState, useEffect, useContext } from 'react';
import { addSeconds, formatDistanceToNow } from 'date-fns';
import snxJSConnector from '../../../helpers/snxJSConnector';

import { Store } from '../../../store';
import { SliderContext } from '../../../components/ScreenSlider';
import { updateCurrentTab } from '../../../ducks/ui';

import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';
import { bytesFormatter, bigNumberFormatter } from '../../../helpers/formatters';

import { createTransaction } from '../../../ducks/transactions';
import { updateGasLimit, fetchingGasLimit } from '../../../ducks/network';
import errorMapper from '../../../helpers/errorMapper';

import { GWEI_UNIT, DEFAULT_GAS_LIMIT } from '../../../helpers/networkHelper';

const getFeePeriodCountdown = (periodIndex, recentFeePeriods, feePeriodDuration) => {
	if (!recentFeePeriods) return;
	const currentFeePeriod = recentFeePeriods[periodIndex];
	const currentPeriodStart =
		currentFeePeriod && currentFeePeriod.startTime
			? new Date(parseInt(currentFeePeriod.startTime * 1000))
			: null;
	const currentPeriodEnd =
		currentPeriodStart && feePeriodDuration
			? addSeconds(currentPeriodStart, feePeriodDuration * 2 - periodIndex)
			: null;
	return `${formatDistanceToNow(currentPeriodEnd)} left`;
};

const useGetFeeData = walletAddress => {
	const [data, setData] = useState({});
	useEffect(() => {
		const getFeeData = async () => {
			const xdrBytes = bytesFormatter('XDR');
			const sUSDBytes = bytesFormatter('sUSD');
			try {
				setData({ ...data, dataIsLoading: true });
				const [
					feesByPeriod,
					feePeriodDuration,
					recentFeePeriods,
					feesAreClaimable,
					feesAvailable,
					xdrRate,
				] = await Promise.all([
					snxJSConnector.snxJS.FeePool.feesByPeriod(walletAddress),
					snxJSConnector.snxJS.FeePool.feePeriodDuration(),
					Promise.all(
						Array.from(Array(2).keys()).map(period =>
							snxJSConnector.snxJS.FeePool.recentFeePeriods(period)
						)
					),
					snxJSConnector.snxJS.FeePool.feesClaimable(walletAddress),
					snxJSConnector.snxJS.FeePool.feesAvailable(walletAddress, sUSDBytes),
					snxJSConnector.snxJS.ExchangeRates.rateForCurrency(xdrBytes),
				]);
				const formattedXdrRate = bigNumberFormatter(xdrRate);
				const formattedFeesByPeriod = feesByPeriod.slice(1).map(([fee, reward], i) => {
					return {
						fee: bigNumberFormatter(fee) * formattedXdrRate,
						reward: bigNumberFormatter(reward),
						closeIn: getFeePeriodCountdown(i, recentFeePeriods, feePeriodDuration),
					};
				});
				setData({
					feesByPeriod: formattedFeesByPeriod,
					feesAreClaimable,
					feesAvailable: feesAvailable.map(bigNumberFormatter),
					dataIsLoading: false,
				});
			} catch (e) {
				console.log(e);
			}
		};
		getFeeData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [walletAddress]);
	return data;
};

const useGetGasEstimate = () => {
	const { dispatch } = useContext(Store);
	const [error, setError] = useState(null);
	useEffect(() => {
		const sUSDBytes = bytesFormatter('sUSD');
		const getGasEstimate = async () => {
			setError(null);
			let gasEstimate;
			try {
				fetchingGasLimit(dispatch);
				gasEstimate = await snxJSConnector.snxJS.FeePool.contract.estimate.claimFees(sUSDBytes);
			} catch (e) {
				console.log(e);
				const errorMessage = (e && e.message) || 'Error while getting gas estimate';
				setError(errorMessage);
				gasEstimate = DEFAULT_GAS_LIMIT['burn'];
			}
			updateGasLimit(Number(gasEstimate), dispatch);
		};
		getGasEstimate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return error;
};

const Claim = ({ onDestroy }) => {
	const { handleNext, handlePrev } = useContext(SliderContext);
	const sUSDBytes = bytesFormatter('sUSD');
	const [transactionInfo, setTransactionInfo] = useState({});
	const {
		state: {
			wallet: { currentWallet, walletType },
			network: {
				settings: { gasPrice, gasLimit, isFetchingGasLimit },
			},
		},
		dispatch,
	} = useContext(Store);
	const { feesByPeriod, feesAreClaimable, feesAvailable, dataIsLoading } = useGetFeeData(
		currentWallet
	);
	const gasEstimateError = useGetGasEstimate();

	const onClaim = async () => {
		try {
			handleNext(1);
			const transaction = await snxJSConnector.snxJS.FeePool.claimFees(sUSDBytes, {
				gasPrice: gasPrice * GWEI_UNIT,
				gasLimit,
			});
			if (transaction) {
				setTransactionInfo({ transactionHash: transaction.hash });
				createTransaction(
					{
						hash: transaction.hash,
						status: 'pending',
						info: 'Claiming rewards',
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

	const onClaimHistory = () => {
		updateCurrentTab('escrow', dispatch);
	};

	const props = {
		onDestroy,
		onClaim,
		onClaimHistory,
		goBack: handlePrev,
		feesByPeriod,
		feesAreClaimable,
		feesAvailable,
		walletType,
		dataIsLoading,
		...transactionInfo,
		gasEstimateError,
		isFetchingGasLimit,
	};
	return [Action, Confirmation, Complete].map((SlideContent, i) => (
		<SlideContent key={i} {...props} />
	));
};

export default Claim;
