import React, { useContext, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import snxJSConnector from '../../helpers/snxJSConnector';
import Slider, { SliderContext } from '../../components/ScreenSlider';

import Confirmation from './Confirmation';
import Complete from './Complete';
import { getWalletDetails } from '../../ducks/wallet';
import { createTransaction } from '../../ducks/transactions';
import { getCurrentGasPrice } from '../../ducks/network';
import errorMapper from '../../helpers/errorMapper';

const SliderController = ({
	amount,
	label,
	contractFunction,
	gasLimit,
	onDestroy,
	param,
	currentGasPrice,
	createTransaction,
	walletDetails,
	action,
}) => {
	const [transactionInfo, setTransactionInfo] = useState({});
	const { handleNext, hasLoaded } = useContext(SliderContext);
	const { walletType, networkName } = walletDetails;
	useEffect(() => {
		const { sBTCRewardsContract } = snxJSConnector;
		const contract = sBTCRewardsContract;
		const run = async () => {
			if (!hasLoaded) return;
			try {
				const transactionSettings = {
					gasPrice: currentGasPrice.formattedPrice,
					gasLimit,
				};
				const transaction = param
					? await contract[contractFunction](param, transactionSettings)
					: await contract[contractFunction](transactionSettings);

				if (transaction) {
					setTransactionInfo({ transactionHash: transaction.hash });
					createTransaction({
						hash: transaction.hash,
						status: 'pending',
						info: label,
						hasNotification: true,
					});
					handleNext(2);
				}
			} catch (e) {
				console.log(e);
				const errorMessage = errorMapper(e, walletType);
				console.log(errorMessage);
				setTransactionInfo({ ...transactionInfo, transactionError: errorMessage });
				handleNext(2);
			}
		};
		run();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasLoaded]);

	const props = {
		onDestroy,
		walletType,
		amount,
		label,
		gasLimit,
		...transactionInfo,
		networkName,
	};
	return [Confirmation, Complete].map((SlideContent, i) => <SlideContent key={i} {...props} />);
};

const UnipoolActions = props => {
	if (!props.action) return null;
	return (
		<Slider>
			<SliderController {...props} />
		</Slider>
	);
};

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
	currentGasPrice: getCurrentGasPrice(state),
});

const mapDispatchToProps = {
	createTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(UnipoolActions);
