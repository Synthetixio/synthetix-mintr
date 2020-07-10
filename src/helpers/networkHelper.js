import throttle from 'lodash/throttle';
import invert from 'lodash/invert';

import { NETWORK_SPEEDS_TO_KEY } from '../constants/network';
import { URLS } from '../constants/urls';
import { GWEI_UNIT, GAS_LIMIT_BUFFER_PERCENTAGE } from '../constants/network';

export const SUPPORTED_NETWORKS = {
	1: 'MAINNET',
	3: 'ROPSTEN',
	4: 'RINKEBY',
	42: 'KOVAN',
};

export const SUPPORTED_NETWORKS_MAP = invert(SUPPORTED_NETWORKS);

export const DEFAULT_GAS_LIMIT = {
	mint: 2200000,
	burn: 2200000,
	claim: 1400000,
	exchange: 220000,
	sendSNX: 120000,
	sendEth: 21000,
	sendSynth: 150000,
};

const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;
const INFURA_ARCHIVE_PROJECT_ID = process.env.REACT_APP_INFURA_ARCHIVE_PROJECT_ID;

export const INFURA_JSON_RPC_URLS = {
	1: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
	3: `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`,
	4: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
	42: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
};

export const PORTIS_APP_ID = '81b6e4b9-9f28-4cce-b41f-2de90c4f906f';

export const INFURA_ARCHIVE_JSON_RPC_URL = `https://mainnet.infura.io/v3/${INFURA_ARCHIVE_PROJECT_ID}`;

export const SUPPORTED_WALLETS_MAP = {
	METAMASK: 'Metamask',
	TREZOR: 'Trezor',
	LEDGER: 'Ledger',
	COINBASE: 'Coinbase',
	WALLET_CONNECT: 'WalletConnect',
	PORTIS: 'Portis',
};

export const SUPPORTED_WALLETS = Object.values(SUPPORTED_WALLETS_MAP);

export const hasWeb3 = () => {
	return window.web3;
};

export async function getEthereumNetwork() {
	if (!window.web3) return { name: 'MAINNET', networkId: 1 };
	let networkId = 1;
	try {
		if (window.web3?.eth?.net) {
			networkId = await window.web3.eth.net.getId();
			return { name: SUPPORTED_NETWORKS[networkId], networkId: Number(networkId) };
		} else if (window.web3?.version?.network) {
			networkId = Number(window.web3.version.network);
			return { name: SUPPORTED_NETWORKS[networkId], networkId };
		} else if (window.ethereum?.networkVersion) {
			networkId = Number(window.ethereum?.networkVersion);
			return { name: SUPPORTED_NETWORKS[networkId], networkId };
		}
		return { name: 'MAINNET', networkId };
	} catch (e) {
		console.log(e);
		return { name: 'MAINNET', networkId };
	}
}

export const getNetworkSpeeds = async () => {
	const result = await fetch(URLS.ETH_GAS_STATION);
	const networkInfo = await result.json();
	return {
		[NETWORK_SPEEDS_TO_KEY.SLOW]: {
			price: networkInfo.safeLow / 10,
			time: networkInfo.safeLowWait,
		},
		[NETWORK_SPEEDS_TO_KEY.AVERAGE]: {
			price: networkInfo.average / 10,
			time: networkInfo.avgWait,
		},
		[NETWORK_SPEEDS_TO_KEY.FAST]: {
			price: networkInfo.fast / 10,
			time: networkInfo.fastWait,
		},
	};
};

export const formatGasPrice = gasPrice => gasPrice * GWEI_UNIT;

export const getTransactionPrice = (gasPrice, gasLimit, ethPrice) => {
	if (!gasPrice || !gasLimit) return 0;
	return (gasPrice * ethPrice * gasLimit) / GWEI_UNIT;
};

export function onMetamaskAccountChange(cb) {
	if (!window.ethereum) return;
	const listener = throttle(cb, 1000);
	window.ethereum.on('accountsChanged', listener);
}

export function onMetamaskNetworkChange(cb) {
	if (!window.ethereum) return;
	const listener = throttle(cb, 1000);
	window.ethereum.on('networkChanged', listener);
}

export const addBufferToGasLimit = gasLimit =>
	Math.round(Number(gasLimit) * (1 + GAS_LIMIT_BUFFER_PERCENTAGE));

export const isMainNet = networkId => networkId === SUPPORTED_NETWORKS_MAP.MAINNET;
