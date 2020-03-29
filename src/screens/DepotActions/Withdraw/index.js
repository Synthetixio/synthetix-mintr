import React, { useContext, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import snxJSConnector from '../../../helpers/snxJSConnector';
import { formatCurrency } from '../../../helpers/formatters';
import { SliderContext } from '../../../components/ScreenSlider';
import { getCurrentGasPrice } from '../../../ducks/network';
import { getWalletDetails } from '../../../ducks/wallet';
import { createTransaction } from '../../../ducks/transactions';
import errorMapper from '../../../helpers/errorMapper';

import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

const useGetGasEstimate = (setFetchingGasLimit, setGasLimit) => {
	const [error, setError] = useState(null);
	useEffect(() => {
		const {
			snxJS: { Depot },
		} = snxJSConnector;
		const getGasEstimate = async () => {
			setError(null);
			try {
				setFetchingGasLimit(true);
				const gasEstimate = await Depot.contract.estimate.withdrawMyDepositedSynths();
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

const Withdraw = ({
	onDestroy,
	amountAvailable,
	walletDetails,
	createTransaction,
	currentGasPrice,
}) => {
	const { handleNext, handlePrev } = useContext(SliderContext);
	const [transactionInfo, setTransactionInfo] = useState({});
	const { walletType, networkName } = walletDetails;
	const [isFetchingGasLimit, setFetchingGasLimit] = useState(false);
	const [gasLimit, setGasLimit] = useState(0);

	const gasEstimateError = useGetGasEstimate(setFetchingGasLimit, setGasLimit);

	const onWithdraw = async () => {
		try {
			handleNext(1);
			const transaction = await snxJSConnector.snxJS.Depot.withdrawMyDepositedSynths({
				gasPrice: currentGasPrice.formattedPrice,
				gasLimit,
			});
			if (transaction) {
				setTransactionInfo({ transactionHash: transaction.hash });
				createTransaction({
					hash: transaction.hash,
					status: 'pending',
					info: `Withdrawing ${formatCurrency(amountAvailable)} sUSD`,
					hasNotification: true,
				});
				handleNext(2);
			}
		} catch (e) {
			console.log(e);
			const errorMessage = errorMapper(e, walletType);
			console.log(errorMessage);
			setTransactionInfo({ ...transactionInfo, transactionError: e });
			handleNext(2);
		}
	};

	const props = {
		onDestroy,
		onWithdraw,
		goBack: handlePrev,
		amountAvailable,
		...transactionInfo,
		walletType,
		networkName,
		gasEstimateError,
		isFetchingGasLimit,
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Withdraw);
