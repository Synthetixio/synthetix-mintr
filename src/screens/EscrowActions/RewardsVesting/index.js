import React, { useContext, useState, useLayoutEffect } from 'react';
import { connect } from 'react-redux';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { SliderContext } from '../../../components/ScreenSlider';

import { fetchEscrowRequest } from 'ducks/escrow';
import { getCurrentGasPrice } from '../../../ducks/network';
import { getWalletDetails } from '../../../ducks/wallet';

import errorMapper from '../../../helpers/errorMapper';

import Confirmation from './Confirmation';
import Complete from './Complete';
import { useNotifyContext } from 'contexts/NotifyContext';
import { notifyHandler } from 'helpers/notifyHelper';

const RewardsVesting = ({
	onDestroy,
	vestAmount,
	walletDetails,
	currentGasPrice,
	gasLimit,
	isFetchingGasLimit,
	fetchEscrowRequest,
}) => {
	const { handleNext, hasLoaded } = useContext(SliderContext);
	const [transactionInfo, setTransactionInfo] = useState({});
	const { walletType, networkName, networkId } = walletDetails;
	const { notify } = useNotifyContext();

	useLayoutEffect(() => {
		const vest = async () => {
			if (!hasLoaded) return;
			const {
				snxJS: { RewardEscrow },
			} = snxJSConnector;
			try {
				const transaction = await RewardEscrow.vest({
					gasPrice: currentGasPrice.formattedPrice,
					gasLimit,
				});
				if (notify && transaction) {
					const refetch = () => {
						fetchEscrowRequest();
					};
					const message = `Vesting confirmed`;
					setTransactionInfo({ transactionHash: transaction.hash });
					notifyHandler(notify, transaction.hash, networkId, refetch, message);
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
	fetchEscrowRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(RewardsVesting);
