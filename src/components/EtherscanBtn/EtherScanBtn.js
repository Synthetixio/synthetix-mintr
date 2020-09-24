import React from 'react';
import { ButtonSecondary } from '../../components/Button';
import { getEtherscanTxLink } from '../../helpers/explorers';

export default function EtherScanBtn({ networkName, transactionHash, children }) {
	return (
		<ButtonSecondary href={getEtherscanTxLink(420, transactionHash)} as="a" target="_blank">
			{children}
		</ButtonSecondary>
	);
}
