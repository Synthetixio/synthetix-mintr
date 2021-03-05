import snxJSConnector from './snxJSConnector';

const getEtherScanBaseURL = isL1 => {
	if (isL1) {
		return 'https://etherscan.io';
	}
	const network = snxJSConnector.snxJS.network.replace('Ovm', '');
	return `https://${network}-l2-explorer.surge.sh`;
};

export const getEtherscanTxLink = (txId, isL1) => {
	const baseURL = getEtherScanBaseURL(isL1);

	return `${baseURL}/tx/${txId}`;
};

export const getEtherscanAddressLink = address => {
	const baseURL = getEtherScanBaseURL();

	return `${baseURL}/address/${address}`;
};
