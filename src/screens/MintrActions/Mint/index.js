import React, { useContext, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { addBufferToGasLimit } from '../../../helpers/networkHelper';
import { SliderContext } from '../../../components/ScreenSlider';
import { bytesFormatter, bigNumberFormatter, formatCurrency } from '../../../helpers/formatters';

import errorMapper from '../../../helpers/errorMapper';
import { createTransaction } from '../../../ducks/transactions';
import { getCurrentGasPrice } from '../../../ducks/network';
import { getWalletDetails } from '../../../ducks/wallet';

const useGetIssuanceData = (walletAddress, sUSDBytes) => {
	const [data, setData] = useState({});
	const SNXBytes = bytesFormatter('SNX');
	useEffect(() => {
		const getIssuanceData = async () => {
			try {
				const results = await Promise.all([
					snxJSConnector.snxJS.Synthetix.maxIssuableSynths(walletAddress, sUSDBytes),
					snxJSConnector.snxJS.Synthetix.debtBalanceOf(walletAddress, sUSDBytes),
					snxJSConnector.snxJS.SystemSettings.issuanceRatio(),
					snxJSConnector.snxJS.ExchangeRates.rateForCurrency(SNXBytes),
					snxJSConnector.snxJS.Synthetix.collateral(walletAddress),
				]);
				const [maxIssuableSynths, debtBalance, issuanceRatio, SNXPrice, snxBalance] = results.map(
					bigNumberFormatter
				);
				const issuableSynths = Math.max(0, maxIssuableSynths - debtBalance);
				setData({ issuableSynths, debtBalance, issuanceRatio, SNXPrice, snxBalance });
			} catch (e) {
				console.log(e);
			}
		};
		getIssuanceData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [walletAddress]);
	return data;
};

const useGetGasEstimate = (mintAmount, issuableSynths, setFetchingGasLimit, setGasLimit) => {
	const { t } = useTranslation();
	const [error, setError] = useState(null);
	useEffect(() => {
		if (!mintAmount) return;
		const getGasEstimate = async () => {
			setError(null);
			setFetchingGasLimit(true);
			let gasEstimate;
			try {
				const {
					snxJS: { Synthetix },
				} = snxJSConnector;
				if (!parseFloat(mintAmount)) throw new Error('input.error.invalidAmount');
				if (mintAmount <= 0 || mintAmount > issuableSynths)
					throw new Error('input.error.notEnoughToMint');
				if (mintAmount === issuableSynths) {
					gasEstimate = await Synthetix.contract.estimateGas.issueMaxSynths();
				} else {
					gasEstimate = await Synthetix.contract.estimateGas.issueSynths(
						snxJSConnector.utils.parseEther(mintAmount.toString())
					);
				}
				setFetchingGasLimit(false);
				setGasLimit(Number(gasEstimate));
			} catch (e) {
				console.log(e);
				setFetchingGasLimit(false);
				const errorMessage = (e && e.message) || 'input.error.gasEstimate';
				setError(t(errorMessage));
			}
		};
		getGasEstimate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mintAmount]);
	return error;
};

const Mint = ({ onDestroy, walletDetails, currentGasPrice, createTransaction }) => {
	const { handleNext, handlePrev } = useContext(SliderContext);
	const [mintAmount, setMintAmount] = useState('');
	const [transactionInfo, setTransactionInfo] = useState({});
	const { currentWallet, walletType, networkName } = walletDetails;
	const [isFetchingGasLimit, setFetchingGasLimit] = useState(false);
	const [gasLimit, setGasLimit] = useState(0);

	const sUSDBytes = bytesFormatter('sUSD');
	const { issuableSynths, issuanceRatio, SNXPrice, debtBalance, snxBalance } = useGetIssuanceData(
		currentWallet,
		sUSDBytes
	);

	const gasEstimateError = useGetGasEstimate(
		mintAmount,
		issuableSynths,
		setFetchingGasLimit,
		setGasLimit
	);

	const onMint = async () => {
		const transactionSettings = {
			gasPrice: 0,
			gasLimit,
		};
		try {
			const {
				snxJS: { Synthetix },
			} = snxJSConnector;
			handleNext(1);
			let transaction;
			if (mintAmount === issuableSynths) {
				transaction = await Synthetix.issueMaxSynths(transactionSettings);
			} else {
				transaction = await Synthetix.issueSynths(
					snxJSConnector.utils.parseEther(mintAmount.toString()),
					transactionSettings
				);
			}
			if (transaction) {
				setTransactionInfo({ transactionHash: transaction.hash });
				createTransaction({
					hash: transaction.hash,
					status: 'pending',
					info: `Minting ${formatCurrency(mintAmount)} sUSD`,
					hasNotification: true,
					type: 'mint',
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
		onMint,
		issuableSynths,
		goBack: handlePrev,
		walletType,
		networkName,
		mintAmount,
		setMintAmount,
		issuanceRatio,
		SNXPrice,
		...transactionInfo,
		isFetchingGasLimit,
		gasLimit,
		gasEstimateError,
		debtBalance,
		snxBalance,
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

export default connect(mapStateToProps, mapDispatchToProps)(Mint);
