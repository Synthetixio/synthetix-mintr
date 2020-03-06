import React, { useContext, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import snxJSConnector from '../../../helpers/snxJSConnector';
import { formatCurrency } from '../../../helpers/formatters';
import { SliderContext } from '../../../components/ScreenSlider';
import { GWEI_UNIT } from '../../../helpers/networkHelper';
import { updateGasLimit, fetchingGasLimit, getNetworkSettings } from '../../../ducks/network';
import { getWalletDetails } from '../../../ducks/wallet';
import { createTransaction } from '../../../ducks/transactions';
import errorMapper from '../../../helpers/errorMapper';

import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

const useGetGasEstimate = amountAvailable => {
	const [error, setError] = useState(null);
	useEffect(() => {
		if (!amountAvailable) return;
		const getGasEstimate = async () => {
			setError(null);
			let gasEstimate = 0;
			try {
				fetchingGasLimit();
				gasEstimate = await snxJSConnector.snxJS.Depot.contract.estimate.withdrawMyDepositedSynths();
			} catch (e) {
				console.log(e);
				const errorMessage = (e && e.message) || 'Error while getting gas estimate';
				setError(errorMessage);
			}
			updateGasLimit(Number(gasEstimate));
		};
		getGasEstimate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [amountAvailable]);
	return error;
};

const Withdraw = ({
	onDestroy,
	amountAvailable,
	walletDetails,
	networkSettings,
	createTransaction,
}) => {
	const { handleNext, handlePrev } = useContext(SliderContext);
	const [transactionInfo, setTransactionInfo] = useState({});
	const { walletType, networkName } = walletDetails;
	const { gasPrice, gasLimit, isFetchingGasLimit } = networkSettings;
	const gasEstimateError = useGetGasEstimate(amountAvailable);

	const onWithdraw = async () => {
		try {
			handleNext(1);
			const transaction = await snxJSConnector.snxJS.Depot.withdrawMyDepositedSynths({
				gasPrice: gasPrice * GWEI_UNIT,
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
	};

	return [Action, Confirmation, Complete].map((SlideContent, i) => (
		<SlideContent key={i} {...props} />
	));
};

const mapStateToProps = state => ({
	networkSettings: getNetworkSettings(state),
	walletDetails: getWalletDetails(state),
});

const mapDispatchToProps = {
	updateGasLimit,
	fetchingGasLimit,
	createTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Withdraw);
