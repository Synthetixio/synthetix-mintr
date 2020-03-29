import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { addSeconds, formatDistanceToNow } from 'date-fns';
import snxJSConnector from '../../../helpers/snxJSConnector';

import { SliderContext } from '../../../components/ScreenSlider';
import { setCurrentTab } from '../../../ducks/ui';

import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';
import { bigNumberFormatter } from '../../../helpers/formatters';

import { createTransaction } from '../../../ducks/transactions';
import { getCurrentGasPrice } from '../../../ducks/network';
import { getWalletDetails } from '../../../ducks/wallet';
import errorMapper from '../../../helpers/errorMapper';

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

const useGetGasEstimate = (setFetchingGasLimit, setGasLimit) => {
	const [error, setError] = useState(null);
	useEffect(() => {
		const getGasEstimate = async () => {
			setError(null);
			try {
				const {
					snxJS: { FeePool },
				} = snxJSConnector;
				setFetchingGasLimit(true);
				const gasEstimate = await FeePool.contract.estimate.claimFees();
				setFetchingGasLimit(false);
				setGasLimit(Number(gasEstimate));
			} catch (e) {
				console.log(e);
				setFetchingGasLimit(false);
				const errorMessage = (e && e.message) || 'Error while getting gas estimate';
				setError(errorMessage);
			}
		};
		getGasEstimate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return error;
};

const Claim = ({ onDestroy, walletDetails, currentGasPrice, createTransaction, setCurrentTab }) => {
	const { handleNext, handlePrev } = useContext(SliderContext);
	const [transactionInfo, setTransactionInfo] = useState({});
	const { currentWallet, walletType, networkName } = walletDetails;
	const [isFetchingGasLimit, setFetchingGasLimit] = useState(false);
	const [gasLimit, setGasLimit] = useState(0);

	const { feesByPeriod, feesAreClaimable, feesAvailable, dataIsLoading } = useGetFeeData(
		currentWallet
	);
	const gasEstimateError = useGetGasEstimate(setFetchingGasLimit, setGasLimit);

	const onClaim = async () => {
		try {
			const {
				snxJS: { FeePool },
			} = snxJSConnector;
			handleNext(1);
			const transaction = await FeePool.claimFees({
				gasPrice: currentGasPrice.formattedPrice,
				gasLimit,
			});
			if (transaction) {
				setTransactionInfo({ transactionHash: transaction.hash });
				createTransaction({
					hash: transaction.hash,
					status: 'pending',
					info: 'Claiming rewards',
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

	const onClaimHistory = () => {
		setCurrentTab({
			tab: 'transactionsHistory',
			params: {
				filters: ['FeesClaimed'],
			},
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
		gasLimit,
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
	setCurrentTab,
};

export default connect(mapStateToProps, mapDispatchToProps)(Claim);
