import React, { useContext, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

import snxJSConnector from 'helpers/snxJSConnector';
import { SliderContext } from 'components/ScreenSlider';
import errorMapper from 'helpers/errorMapper';

import { createTransaction } from 'ducks/transactions';
import { getCurrentGasPrice } from 'ducks/network';
import { getDebtStatusData, fetchDebtStatusRequest } from 'ducks/debtStatus';
import { fetchEscrowRequest } from 'ducks/escrow';
import { fetchBalancesRequest } from 'ducks/balances';
import { getWalletDetails } from 'ducks/wallet';
import { formatCurrency } from 'helpers/formatters';

import { L2_EVENTS } from 'constants/events';

const DEFAULT_GAS_PRICE = 0;

const Withdraw = ({
	onDestroy,
	walletDetails,
	currentGasPrice,
	createTransaction,
	walletBalances,
	debtStatus,
	fetchBalancesRequest,
	fetchDebtStatusRequest,
	fetchEscrowRequest,
}) => {
	const { handleNext } = useContext(SliderContext);
	const { t } = useTranslation();
	const { walletType, networkName, currentWallet } = walletDetails;

	const [transactionInfo, setTransactionInfo] = useState({});
	const [isFetchingGasLimit, setFetchingGasLimit] = useState(false);

	const [gasLimit, setGasLimit] = useState(0);
	const [gasEstimateError, setGasEstimateError] = useState(null);

	const snxBalance = debtStatus?.transferable ?? 0;
	const snxBalanceBN = debtStatus?.transferableBN ?? 0;
	const fraudProofWindow = debtStatus?.fraudProofWindow ?? 0;

	useEffect(() => {
		const {
			snxJS: { SynthetixBridgeToBase },
		} = snxJSConnector;

		const getGasEstimate = async () => {
			setGasEstimateError(null);
			try {
				setFetchingGasLimit(true);
				const gasEstimate = await SynthetixBridgeToBase.contract.estimate.initiateWithdrawal(
					snxBalanceBN
				);

				setGasLimit(Number(gasEstimate));
			} catch (e) {
				console.log(e);
				const errorMessage = (e && e.message) || 'input.error.gasEstimate';
				setGasEstimateError(t(errorMessage));
			}
			setFetchingGasLimit(false);
		};
		getGasEstimate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [snxBalanceBN]);

	useEffect(() => {
		if (!currentWallet) return;
		const {
			snxJS: { SynthetixBridgeToBase },
		} = snxJSConnector;

		SynthetixBridgeToBase.contract.on(L2_EVENTS.WITHDRAWAL_INITIATED, account => {
			if (account === currentWallet) {
				localStorage.setItem(L2_EVENTS.WITHDRAWAL_INITIATED, Date.now());
				fetchBalancesRequest();
				fetchDebtStatusRequest();
				fetchEscrowRequest();
			}
		});
		return () => {
			SynthetixBridgeToBase.contract.removeAllListeners(L2_EVENTS.WITHDRAWAL_INITIATED);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet]);

	const onWithdraw = async () => {
		const transactionSettings = {
			gasPrice: DEFAULT_GAS_PRICE,
			gasLimit,
		};
		try {
			localStorage.setItem(L2_EVENTS.WITHDRAWAL_INITIATED, Date.now());
			const {
				snxJS: { SynthetixBridgeToBase },
			} = snxJSConnector;

			handleNext(1);
			const transaction = await SynthetixBridgeToBase.initiateWithdrawal(
				snxBalanceBN,
				transactionSettings
			);
			if (transaction) {
				setTransactionInfo({ transactionHash: transaction.hash });
				createTransaction({
					hash: transaction.hash,
					status: 'pending',
					info: `Withdrawing ${formatCurrency(snxBalance)} SNX`,
					hasNotification: true,
					type: 'withdraw',
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
		onWithdraw,
		snxBalance,
		isFetchingGasLimit,
		gasLimit,
		gasEstimateError,
		...transactionInfo,
		walletType,
		networkName,
		fraudProofWindow,
	};

	return [Action, Confirmation, Complete].map((SlideContent, i) => (
		<SlideContent key={i} {...props} />
	));
};

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
	currentGasPrice: getCurrentGasPrice(state),
	debtStatus: getDebtStatusData(state),
});

const mapDispatchToProps = {
	createTransaction,
	fetchBalancesRequest,
	fetchDebtStatusRequest,
	fetchEscrowRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Withdraw);
