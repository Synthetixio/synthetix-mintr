import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import { Watcher } from '@eth-optimism/watcher';
import { JsonRpcProvider } from 'ethers/providers';

import { ReactComponent as SwitchingIcon } from '../../assets/images/L2/switching.svg';
import { HeaderIcon } from 'components/L2Onboarding/HeaderIcon';
import Spinner from 'components/Spinner';
import { Stepper } from '../../components/L2Onboarding/Stepper';

import {
	INFURA_JSON_RPC_URLS,
	OVM_RPC_URL,
	L1_MESSENGER_ADDRESS,
	L2_MESSENGER_ADDRESS,
} from 'helpers/networkHelper';

interface SwitchInProgressProps {
	onComplete: Function;
	networkId: number;
	transactionHash: string;
}

const SwitchInProgress: FC<SwitchInProgressProps> = ({
	onComplete,
	networkId,
	transactionHash,
}) => {
	useEffect(() => {
		const listen = async () => {
			const watcher = new Watcher({
				l1: {
					provider: new JsonRpcProvider(INFURA_JSON_RPC_URLS[networkId]),
					messengerAddress: L1_MESSENGER_ADDRESS,
				},
				l2: {
					provider: new JsonRpcProvider(OVM_RPC_URL),
					messengerAddress: L2_MESSENGER_ADDRESS,
				},
			});

			await watcher.l1.provider.waitForTransaction(transactionHash);
			const [messageHash] = await watcher.getMessageHashesFromL1Tx(transactionHash);
			const receiptL2 = await watcher.getL2TransactionReceipt(messageHash);
			console.log('Got L2 Tx Hash:', receiptL2.transactionHash);
			onComplete(receiptL2.transactionHash);
		};
		listen();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [transactionHash]);

	return (
		<PageContainer>
			<Stepper activeIndex={2} />
			<HeaderIcon
				title="Migration in progress..."
				subtext="This may take a few minutes to process. If it takes more than ten minutes, try refreshing the page."
				icon={<SwitchingIcon />}
			/>
			<Spinner />
		</PageContainer>
	);
};

const PageContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

export default SwitchInProgress;
