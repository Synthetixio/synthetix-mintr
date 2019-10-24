import React, { useContext, useState, useLayoutEffect } from 'react';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { Store } from '../../../store';
import { SliderContext } from '../../../components/ScreenSlider';

import { GWEI_UNIT } from '../../../helpers/networkHelper';
import { createTransaction } from '../../../ducks/transactions';
import errorMapper from '../../../helpers/errorMapper';

import Confirmation from './Confirmation';
import Complete from './Complete';

const RewardsVesting = ({ onDestroy, vestAmount }) => {
	const { handleNext, hasLoaded } = useContext(SliderContext);
	const [transactionInfo, setTransactionInfo] = useState({});
	const {
		state: {
			wallet: { walletType, networkName },
			network: {
				settings: { gasPrice, gasLimit },
			},
		},
		dispatch,
	} = useContext(Store);

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
					createTransaction(
						{
							hash: transaction.hash,
							status: 'pending',
							info: 'Vesting',
							hasNotification: true,
						},
						dispatch
					);
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

export default RewardsVesting;
