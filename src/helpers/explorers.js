import { SUPPORTED_NETWORKS, isMainNet } from './networkHelper';

const getEtherScanBaseURL = (networkId, isL1) => {
	const network = SUPPORTED_NETWORKS[networkId];

	if (isL1) {
		return 'https://goerli.etherscan.io';
	}

	if (networkId === 420) {
		return 'https://l2-explorer.surge.sh';
	}
	if (isMainNet(networkId) || network == null) {
		return 'https://etherscan.io';
	}

	return `https://${network.toLowerCase()}.etherscan.io`;
};

export const getEtherscanTxLink = (networkId, txId, isL1) => {
	const baseURL = getEtherScanBaseURL(networkId, isL1);

	return `${baseURL}/tx/${txId}`;
};

export const getEtherscanAddressLink = (networkId, address) => {
	const baseURL = getEtherScanBaseURL(networkId);

	return `${baseURL}/address/${address}`;
};
