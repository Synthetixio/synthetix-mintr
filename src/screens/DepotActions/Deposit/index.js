import React, { useContext, useState, useEffect, useCallback } from 'react';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { Store } from '../../../store';
import { formatCurrency, bigNumberFormatter } from '../../../helpers/formatters';
import { SliderContext } from '../../../components/ScreenSlider';
import { GWEI_UNIT } from '../../../helpers/networkHelper';
import { updateGasLimit, fetchingGasLimit } from '../../../ducks/network';
import { createTransaction } from '../../../ducks/transactions';
import errorMapper from '../../../helpers/errorMapper';

import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';
import { useTranslation } from 'react-i18next';

const ALLOWANCE_LIMIT = 100000000;

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
				const Depot = snxJSConnector.snxJS.Depot;
				gasEstimate = await Depot.contract.estimate.depositSynths(
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
	const { handleNext, handlePrev } = useContext(SliderContext);
	const [depositAmount, setDepositAmount] = useState('');
	const [transactionInfo, setTransactionInfo] = useState({});
	const [hasAllowance, setAllowance] = useState(true);
	const {
		state: {
			wallet: { currentWallet, walletType, networkName },
			network: {
				settings: { isFetchingGasLimit, gasPrice, gasLimit },
			},
		},
		dispatch,
	} = useContext(Store);
	const gasEstimateError = useGetGasEstimate(depositAmount, sUSDBalance, minimumDepositAmount);

	const fetchAllowance = useCallback(async () => {
		try {
			const sUSD = snxJSConnector.snxJS.sUSD;
			const Depot = snxJSConnector.snxJS.Depot;
			const allowance = await sUSD.allowance(currentWallet, Depot.contract.address);
			setAllowance(bigNumberFormatter(allowance));
		} catch (e) {
			console.log(e);
		}
	}, [currentWallet]);

	useEffect(() => {
		fetchAllowance();
	}, [fetchAllowance]);

	useEffect(() => {
		if (!currentWallet) return;
		const sUSD = snxJSConnector.snxJS.sUSD;
		const depotAddress = snxJSConnector.snxJS.Depot.contract.address;
		sUSD.contract.on('Approval', (owner, spender) => {
			if (owner === currentWallet && spender === depotAddress) {
				fetchAllowance();
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet]);

	const onDeposit = async () => {
		try {
			handleNext(1);
			const Depot = snxJSConnector.snxJS.Depot;
			const transaction = await Depot.depositSynths(
				snxJSConnector.utils.parseEther(depositAmount.toString()),
				{
					gasPrice: gasPrice * GWEI_UNIT,
					gasLimit,
				}
			);
			if (transaction) {
				setTransactionInfo({ transactionHash: transaction.hash });
				createTransaction(
					{
						hash: transaction.hash,
						status: 'pending',
						info: `Depositing ${formatCurrency(depositAmount, 2)} sUSD`,
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
			setTransactionInfo({ ...transactionInfo, transactionError: e });
			handleNext(2);
		}
	};

	const onUnlock = async () => {
		const { parseEther } = snxJSConnector.utils;
		const depotAddress = snxJSConnector.snxJS.Depot.contract.address;
		const sUSDContract = snxJSConnector.snxJS.sUSD;
		try {
			const gasEstimate = await sUSDContract.contract.estimate.approve(
				depotAddress,
				parseEther(ALLOWANCE_LIMIT.toString())
			);
			await sUSDContract.approve(depotAddress, parseEther(ALLOWANCE_LIMIT.toString()), {
				gasLimit: Number(gasEstimate) + 10000,
				gasPrice: gasPrice * GWEI_UNIT,
			});
		} catch (e) {
			console.log(e);
		}
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
		hasAllowance,
		onUnlock,
	};

	return [Action, Confirmation, Complete].map((SlideContent, i) => (
		<SlideContent key={i} {...props} />
	));
};

export default Deposit;
