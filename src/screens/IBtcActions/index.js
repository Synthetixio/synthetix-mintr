import React, { useContext, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Slider, { SliderContext } from '../../components/ScreenSlider';

import Confirmation from './Confirmation';
import Complete from './Complete';
import { getWalletDetails } from '../../ducks/wallet';
import { createTransaction } from '../../ducks/transactions';
import { getCurrentGasPrice } from '../../ducks/network';
import errorMapper from '../../helpers/errorMapper';

const addBufferToGasLimit = gasLimit => Math.round(Number(gasLimit) * 1.5);

const SliderController = ({
	amount,
	label,
	contractFunction,
	contractFunctionEstimate,
	onDestroy,
	currentGasPrice,
	createTransaction,
	walletDetails,
}) => {
	const [transactionInfo, setTransactionInfo] = useState({});
	const [transactionSettings, setTransactionSettings] = useState({});
	const { handleNext, hasLoaded } = useContext(SliderContext);
	const { walletType, networkName } = walletDetails;

	useEffect(() => {
		const run = async () => {
			if (!hasLoaded) return;
			try {
				const gasEstimate = await contractFunctionEstimate();

				const settings = {
					gasPrice: currentGasPrice.formattedPrice,
					gasLimit: addBufferToGasLimit(gasEstimate),
				};
				setTransactionSettings(settings);

				const transaction = await contractFunction(settings);

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
		gasLimit: transactionSettings.gasLimit,
		...transactionInfo,
		networkName,
	};
	return [Confirmation, Complete].map((SlideContent, i) => <SlideContent key={i} {...props} />);
};

const IBtcActions = props => {
	return props.action ? (
		<Slider>
			<SliderController {...props} />
		</Slider>
	) : null;
};

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
	currentGasPrice: getCurrentGasPrice(state),
});

const mapDispatchToProps = {
	createTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(IBtcActions);
