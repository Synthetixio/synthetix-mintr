import React, { useContext, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import Action from './Action';
// import Confirmation from './Confirmation';
// import Complete from './Complete';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { addBufferToGasLimit, formatGasPrice } from '../../../helpers/networkHelper';
import { SliderContext } from '../../../components/ScreenSlider';
import { TOKEN_ALLOWANCE_LIMIT } from 'constants/network';

import errorMapper from '../../../helpers/errorMapper';
import { createTransaction } from 'ducks/transactions';
import { getCurrentGasPrice } from 'ducks/network';
import { getWalletBalancesToArray } from 'ducks/balances';
import { getWalletDetails } from 'ducks/wallet';
import { shortenAddress, formatCurrency, bigNumberFormatter } from '../../../helpers/formatters';
import { useTranslation } from 'react-i18next';
import { CRYPTO_CURRENCY_TO_KEY } from 'constants/currency';

const DEFAULT_GAS_PRICE = 1;

const GAS_LIMIT_BUFFER = 10000;

const Withdraw = ({
	onDestroy,
	walletDetails,
	currentGasPrice,
	createTransaction,
	walletBalances,
}) => {
	const { handleNext, handlePrev } = useContext(SliderContext);
	const { t } = useTranslation();
	const { walletType, networkName, currentWallet } = walletDetails;

	const [error, setError] = useState(null);
	const [transactionInfo, setTransactionInfo] = useState({});
	const [isFetchingGasLimit, setFetchingGasLimit] = useState(false);
	const [isWaitingForAllowance, setIsWaitingForAllowance] = useState(false);
	const [hasAllowance, setAllowance] = useState(false);
	const [gasLimit, setGasLimit] = useState(0);
	const [gasEstimateError, setGasEstimateError] = useState(null);

	const snxBalance =
		walletBalances?.find(({ name }) => name === CRYPTO_CURRENCY_TO_KEY.SNX)?.balance ?? 0;

	const fetchAllowance = async () => {
		const {
			snxJS: { Synthetix, SynthetixBridgeToBase },
		} = snxJSConnector;
		try {
			const allowance = await Synthetix.allowance(
				currentWallet,
				SynthetixBridgeToBase.contract.address
			);
			const hasAllowance = bigNumberFormatter(allowance) !== 0;
			setAllowance(hasAllowance ? true : false);
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		if (!currentWallet) return;
		const {
			snxJS: { SynthetixBridgeToBase, Synthetix },
		} = snxJSConnector;

		fetchAllowance();
		SynthetixBridgeToBase.contract.on('WithdrawalInitiated', account => {
			console.log('ddddddd', account);
			if (account === currentWallet) {
				console.log('rororo');
			}
		});
		Synthetix.contract.on('Approval', (owner, spender) => {
			if (owner === currentWallet && spender === SynthetixBridgeToBase.contract.address) {
				setAllowance(true);
				setIsWaitingForAllowance(false);
			}
		});
		return () => {
			SynthetixBridgeToBase.contract.removeAllListeners('WithdrawalInitiated');
			Synthetix.contract.removeAllListeners('Approval');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet]);

	const onWithdraw = async () => {
		console.log('WITHDRAW');
	};

	useEffect(() => {
		const {
			snxJS: { SynthetixBridgeToBase, Synthetix },
			utils,
		} = snxJSConnector;
		const getGasEstimate = async () => {
			setGasEstimateError(null);
			try {
				// setFetchingGasLimit(true);
				let gasEstimate;

				const snxBalanceBN = utils.parseEther(snxBalance.toString());
				gasEstimate = await SynthetixBridgeToBase.contract.estimate.initiateWithdrawal(
					snxBalanceBN
				);

				setGasLimit(addBufferToGasLimit(gasEstimate));
			} catch (e) {
				const errorMessage = (e && e.message) || 'input.error.gasEstimate';
				setGasEstimateError(t(errorMessage));
			}
			// setFetchingGasLimit(false);
		};
		getGasEstimate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setGasLimit]);

	const onApprove = async () => {
		const {
			utils,
			snxJS: { SynthetixBridgeToBase, Synthetix },
		} = snxJSConnector;

		try {
			setIsWaitingForAllowance(true);
			const amountToAllow = utils.parseEther(TOKEN_ALLOWANCE_LIMIT.toString());
			const gasEstimate = await Synthetix.contract.estimate.approve(
				SynthetixBridgeToBase.contract.address,
				amountToAllow
			);
			const transaction = await Synthetix.contract.approve(
				SynthetixBridgeToBase.contract.address,
				amountToAllow,
				{
					gasLimit: Number(gasEstimate) + GAS_LIMIT_BUFFER,
					gasPrice: formatGasPrice(DEFAULT_GAS_PRICE),
				}
			);
			if (transaction) {
				createTransaction({
					hash: transaction.hash,
					status: 'pending',
					info: `Approving SNX`,
					hasNotification: true,
					type: 'approve',
				});
			}
		} catch (e) {
			console.log(e);
			setIsWaitingForAllowance(false);
		}
	};

	console.log(hasAllowance, isFetchingGasLimit, gasEstimateError);

	const props = {
		onDestroy,
		onWithdraw,
		onApprove,
		snxBalance,
		isFetchingGasLimit,
		gasLimit,
		isWaitingForAllowance,
		hasAllowance,
		gasEstimateError: error,
		...transactionInfo,
		walletType,
		networkName,
	};

	return [Action].map((SlideContent, i) => <SlideContent key={i} {...props} />);
};

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
	currentGasPrice: getCurrentGasPrice(state),
	walletBalances: getWalletBalancesToArray(state),
});

const mapDispatchToProps = {
	createTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Withdraw);
