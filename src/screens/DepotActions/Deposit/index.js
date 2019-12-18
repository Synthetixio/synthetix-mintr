import React, { useContext, useState, useEffect } from 'react';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { Store } from '../../../store';
// import { formatCurrency } from '../../../helpers/formatters';
import { SliderContext } from '../../../components/ScreenSlider';
// import { GWEI_UNIT } from '../../../helpers/networkHelper';
import { updateGasLimit, fetchingGasLimit } from '../../../ducks/network';
// import { createTransaction } from '../../../ducks/transactions';
// import errorMapper from '../../../helpers/errorMapper';

import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';
import { useTranslation } from 'react-i18next';

const useGetGasEstimate = (depositAmount, sUSDBalance, minimumDepositAmount) => {
	const { dispatch } = useContext(Store);
	const { t } = useTranslation();
	const [error, setError] = useState(null);
	useEffect(() => {
		if (!depositAmount) return;
		const getGasEstimate = async () => {
			setError(null);
			let gasEstimate = 0;
			try {
				if (depositAmount < minimumDepositAmount)
					throw new Error('input.error.lowerThanMinDeposit');
				if (!Number(depositAmount)) throw new Error('input.error.invalidAmount');
				fetchingGasLimit(dispatch);
				const depotAddress = snxJSConnector.snxJS.Depot.contract.address;
				gasEstimate = await snxJSConnector.snxJS.sUSD.contract.estimate.transfer(
					depotAddress,
					snxJSConnector.utils.parseEther(depositAmount.toString())
				);
			} catch (e) {
				console.log(e);
				const errorMessage = (e && e.message) || 'input.error.gasEstimate';
				setError(t(errorMessage));
			}
			updateGasLimit(Number(gasEstimate), dispatch);
		};
		getGasEstimate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [depositAmount, sUSDBalance, minimumDepositAmount]);
	return error;
};

const Deposit = ({ onDestroy, sUSDBalance, minimumDepositAmount }) => {
	const { handlePrev } = useContext(SliderContext);
	const [depositAmount, setDepositAmount] = useState('');
	const [transactionInfo] = useState({});
	const {
		state: {
			wallet: { walletType, networkName },
			network: {
				settings: { isFetchingGasLimit },
			},
		},
	} = useContext(Store);
	const gasEstimateError = useGetGasEstimate(depositAmount, sUSDBalance, minimumDepositAmount);

	const onDeposit = async () => {
		// try {
		// 	handleNext(1);
		// 	const depotAddress = snxJSConnector.snxJS.Depot.contract.address;
		// 	const transaction = await snxJSConnector.snxJS.sUSD.contract.transfer(
		// 		depotAddress,
		// 		snxJSConnector.utils.parseEther(depositAmount.toString()),
		// 		{
		// 			gasPrice: gasPrice * GWEI_UNIT,
		// 			gasLimit,
		// 		}
		// 	);
		// 	if (transaction) {
		// 		setTransactionInfo({ transactionHash: transaction.hash });
		// 		createTransaction(
		// 			{
		// 				hash: transaction.hash,
		// 				status: 'pending',
		// 				info: `Depositing ${formatCurrency(depositAmount, 2)} sUSD`,
		// 				hasNotification: true,
		// 			},
		// 			dispatch
		// 		);
		// 		handleNext(2);
		// 	}
		// } catch (e) {
		// 	console.log(e);
		// 	const errorMessage = errorMapper(e, walletType);
		// 	console.log(errorMessage);
		// 	setTransactionInfo({ ...transactionInfo, transactionError: e });
		// 	handleNext(2);
		// }
	};

	const props = {
		onDestroy,
		onDeposit,
		goBack: handlePrev,
		sUSDBalance,
		...transactionInfo,
		depositAmount,
		walletType,
		networkName,
		setDepositAmount,
		isFetchingGasLimit,
		gasEstimateError,
	};

	return [Action, Confirmation, Complete].map((SlideContent, i) => (
		<SlideContent key={i} {...props} />
	));
};

export default Deposit;
