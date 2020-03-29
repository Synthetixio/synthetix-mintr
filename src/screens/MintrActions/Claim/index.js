import React, { useState, useEffect, useContext } from 'react';
import { addSeconds, formatDistanceToNow } from 'date-fns';
import snxJSConnector from '../../../helpers/snxJSConnector';

import { Store } from '../../../store';
import { SliderContext } from '../../../components/ScreenSlider';
import { updateCurrentTab } from '../../../ducks/ui';

import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';
import { bigNumberFormatter } from '../../../helpers/formatters';

import { createTransaction } from '../../../ducks/transactions';
import { updateGasLimit, fetchingGasLimit } from '../../../ducks/network';
import errorMapper from '../../../helpers/errorMapper';

import { GWEI_UNIT, DEFAULT_GAS_LIMIT } from '../../../helpers/networkHelper';

const FEE_PERIOD = 0;

const getFeePeriodCountdown = (recentFeePeriods, feePeriodDuration) => {
	if (!recentFeePeriods) return;
	const currentPeriodStart =
		recentFeePeriods && recentFeePeriods.startTime
			? new Date(parseInt(recentFeePeriods.startTime * 1000))
			: null;
	const currentPeriodEnd =
		currentPeriodStart && feePeriodDuration
			? addSeconds(currentPeriodStart, feePeriodDuration)
			: null;
	return `${formatDistanceToNow(currentPeriodEnd)} left`;
};

const useGetFeeData = walletAddress => {
	const [data, setData] = useState({});
	useEffect(() => {
		const getFeeData = async () => {
			try {
				setData({ ...data, dataIsLoading: true });
				const [
					feesByPeriod,
					feePeriodDuration,
					recentFeePeriods,
					feesAreClaimable,
					feesAvailable,
				] = await Promise.all([
					snxJSConnector.snxJS.FeePool.feesByPeriod(walletAddress),
					snxJSConnector.snxJS.FeePool.feePeriodDuration(),
					snxJSConnector.snxJS.FeePool.recentFeePeriods(FEE_PERIOD),
					snxJSConnector.snxJS.FeePool.isFeesClaimable(walletAddress),
					snxJSConnector.snxJS.FeePool.feesAvailable(walletAddress),
				]);

				const formattedFeesByPeriod = feesByPeriod.slice(1).map(([fee, reward]) => {
					return {
						fee: bigNumberFormatter(fee),
						reward: bigNumberFormatter(reward),
						closeIn: getFeePeriodCountdown(recentFeePeriods, feePeriodDuration),
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
		const getGasEstimate = async () => {
			setError(null);
			let gasEstimate;
			try {
				fetchingGasLimit(dispatch);
				gasEstimate = await snxJSConnector.snxJS.FeePool.contract.estimate.claimFees();
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
	const { feesByPeriod, feesAreClaimable, feesAvailable, dataIsLoading } = useGetFeeData(
		currentWallet
	);
	const gasEstimateError = useGetGasEstimate();

	const onClaim = async () => {
		try {
			handleNext(1);
			const transaction = await snxJSConnector.snxJS.FeePool.claimFees({
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
		updateCurrentTab('transactionsHistory', dispatch, {
			filters: ['FeesClaimed'],
		});
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
		networkName,
	};
	return [Action, Confirmation, Complete].map((SlideContent, i) => (
		<SlideContent key={i} {...props} />
	));
};

export default Claim;
