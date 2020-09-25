import { SUPPORTED_NETWORKS, isMainNet } from './networkHelper';

const getEtherScanBaseURL = networkId => {
	const network = SUPPORTED_NETWORKS[networkId];

	if (networkId === 420) {
		return 'https://l2-explorer.surge.sh';
	}
	if (isMainNet(networkId) || network == null) {
		return 'https://etherscan.io';
	}

	return `https://${network.toLowerCase()}.etherscan.io`;
};

export const getEtherscanTxLink = (networkId, txId) => {
	const baseURL = getEtherScanBaseURL(networkId);

	return `${baseURL}/tx/${txId}`;
};

export const getEtherscanAddressLink = (networkId, address) => {
	const baseURL = getEtherScanBaseURL(networkId);

	return `${baseURL}/address/${address}`;
};
