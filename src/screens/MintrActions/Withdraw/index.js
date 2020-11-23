import React, { useContext, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import Action from './Action';
// import Confirmation from './Confirmation';
// import Complete from './Complete';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { addBufferToGasLimit } from '../../../helpers/networkHelper';
import { SliderContext } from '../../../components/ScreenSlider';

import errorMapper from '../../../helpers/errorMapper';
import { createTransaction } from 'ducks/transactions';
import { getCurrentGasPrice } from 'ducks/network';
import { getWalletBalancesToArray } from 'ducks/balances';
import { getWalletDetails } from 'ducks/wallet';
import { shortenAddress, bytesFormatter } from '../../../helpers/formatters';
import { useTranslation } from 'react-i18next';
import { CRYPTO_CURRENCY_TO_KEY } from 'constants/currency';

const Withdraw = ({
	onDestroy,
	walletDetails,
	currentGasPrice,
	createTransaction,
	walletBalances,
}) => {
	const { handleNext, handlePrev } = useContext(SliderContext);
	const { t } = useTranslation();
	const { walletType, networkName } = walletDetails;

	const [error, setError] = useState(null);
	const [transactionInfo, setTransactionInfo] = useState({});
	const [isFetchingGasLimit, setFetchingGasLimit] = useState(false);
	const [gasLimit, setGasLimit] = useState(0);

	const snxBalance =
		walletBalances?.find(({ name }) => name === CRYPTO_CURRENCY_TO_KEY.SNX)?.balance ?? 0;

	const onWithdraw = async () => {
		console.log('WITHDRAW');
	};

	const props = {
		onDestroy,
		onWithdraw,
		snxBalance,
		isFetchingGasLimit,
		gasLimit,
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
