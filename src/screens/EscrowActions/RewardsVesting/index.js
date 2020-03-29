import React, { useContext, useState, useLayoutEffect } from 'react';
import { connect } from 'react-redux';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { SliderContext } from '../../../components/ScreenSlider';

import { createTransaction } from '../../../ducks/transactions';
import { getCurrentGasPrice } from '../../../ducks/network';
import { getWalletDetails } from '../../../ducks/wallet';

import errorMapper from '../../../helpers/errorMapper';

import Confirmation from './Confirmation';
import Complete from './Complete';

const RewardsVesting = ({
	onDestroy,
	vestAmount,
	walletDetails,
	createTransaction,
	currentGasPrice,
	gasLimit,
	isFetchingGasLimit,
}) => {
	const { handleNext, hasLoaded } = useContext(SliderContext);
	const [transactionInfo, setTransactionInfo] = useState({});
	const { walletType, networkName } = walletDetails;

	useLayoutEffect(() => {
		const vest = async () => {
			if (!hasLoaded) return;
			try {
				const transaction = await snxJSConnector.snxJS.RewardEscrow.vest({
					gasPrice: currentGasPrice.formattedPrice,
					gasLimit,
				});
				if (transaction) {
					setTransactionInfo({ transactionHash: transaction.hash });
					createTransaction({
						hash: transaction.hash,
						status: 'pending',
						info: 'Vesting',
						hasNotification: true,
					});
					handleNext(1);
				}
			} catch (e) {
				console.log(e);
				const errorMessage = errorMapper(e, walletType);
				console.log(errorMessage);
				setTransactionInfo({
					...transactionInfo,
					transactionError: errorMessage,
				});
				handleNext(1);
			}
		};
		vest();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasLoaded]);

	const props = {
		onDestroy,
		vestAmount,
		...transactionInfo,
		walletType,
		networkName,
		gasLimit,
		isFetchingGasLimit,
	};

	return [Confirmation, Complete].map((SlideContent, i) => <SlideContent key={i} {...props} />);
};

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
	currentGasPrice: getCurrentGasPrice(state),
});

const mapDispatchToProps = {
	createTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(RewardsVesting);
