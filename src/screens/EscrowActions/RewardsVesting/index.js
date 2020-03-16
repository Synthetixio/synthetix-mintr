import React, { useContext, useState, useLayoutEffect } from 'react';
import { connect } from 'react-redux';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { SliderContext } from '../../../components/ScreenSlider';

import { createTransaction } from '../../../ducks/transactions';
import { getNetworkSettings } from '../../../ducks/network';
import { getWalletDetails } from '../../../ducks/wallet';

import { GWEI_UNIT } from '../../../constants/network';
import errorMapper from '../../../helpers/errorMapper';

import Confirmation from './Confirmation';
import Complete from './Complete';

const RewardsVesting = ({
	onDestroy,
	vestAmount,
	networkSettings,
	walletDetails,
	createTransaction,
}) => {
	const { handleNext, hasLoaded } = useContext(SliderContext);
	const [transactionInfo, setTransactionInfo] = useState({});
	const { walletType, networkName } = walletDetails;
	const { gasPrice, gasLimit } = networkSettings;

	useLayoutEffect(() => {
		const vest = async () => {
			if (!hasLoaded) return;
			try {
				const transaction = await snxJSConnector.snxJS.RewardEscrow.vest({
					gasPrice: gasPrice * GWEI_UNIT,
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
	};

	return [Confirmation, Complete].map((SlideContent, i) => <SlideContent key={i} {...props} />);
};

const mapStateToProps = state => ({
	networkSettings: getNetworkSettings(state),
	walletDetails: getWalletDetails(state),
});

const mapDispatchToProps = {
	createTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(RewardsVesting);
