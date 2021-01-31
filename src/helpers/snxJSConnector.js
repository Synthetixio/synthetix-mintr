import { SynthetixJs } from 'synthetix-js';
import { Contract, providers, ethers } from 'ethers';
import { getEthereumNetwork, INFURA_JSON_RPC_URLS, SUPPORTED_WALLETS_MAP } from './networkHelper';
import { stateCommitmentChain } from 'helpers/contracts';

let snxJSConnector = {
	initialized: false,
	signers: SynthetixJs.signers,
	setContractSettings: function (contractSettings) {
		this.initialized = true;
		this.snxJS = new SynthetixJs(contractSettings);
		this.synths = this.snxJS.contractSettings.synths;
		this.signer = this.snxJS.contractSettings.signer;
		this.provider = this.snxJS.contractSettings.provider;
		this.utils = this.snxJS.utils;
		this.ethersUtils = this.snxJS.ethers.utils;
		this.stateCommitmentChain = new Contract(
			stateCommitmentChain.address,
			stateCommitmentChain.abi,
			new providers.JsonRpcProvider(INFURA_JSON_RPC_URLS[1])
		);
	},
};

const connectToMetamask = async (networkId, networkName) => {
	const walletState = {
		walletType: SUPPORTED_WALLETS_MAP.METAMASK,
		unlocked: false,
	};
	try {
		// Otherwise we enable ethereum if needed (modern browsers)
		if (window.ethereum) {
			window.ethereum.autoRefreshOnNetworkChange = true;
			await window.ethereum.enable();
		}
		const accounts = await snxJSConnector.signer.getNextAddresses();
		if (accounts && accounts.length > 0) {
			return {
				...walletState,
				currentWallet: accounts[0],
				unlocked: true,
				networkId,
				networkName: networkName.toLowerCase(),
			};
		} else {
			return {
				...walletState,
				unlockReason: 'Please connect to Metamask',
			};
		}
		// We updateWalletStatus with all the infos
	} catch (e) {
		console.log(e);
		return {
			...walletState,
			unlockReason: 'ErrorWhileConnectingToMetamask',
			unlockMessage: e,
		};
	}
};

const connectToCoinbase = async (networkId, networkName) => {
	const walletState = {
		walletType: SUPPORTED_WALLETS_MAP.COINBASE,
		unlocked: false,
	};
	try {
		const accounts = await snxJSConnector.signer.getNextAddresses();
		if (accounts && accounts.length > 0) {
			return {
				...walletState,
				currentWallet: accounts[0],
				unlocked: true,
				networkId: 1,
				networkName: networkName.toLowerCase(),
			};
		} else {
			return {
				...walletState,
				unlockReason: 'CoinbaseNoAccounts',
			};
		}
		// We updateWalletStatus with all the infos
	} catch (e) {
		console.log(e);
		return {
			...walletState,
			unlockReason: 'ErrorWhileConnectingToCoinbase',
			unlockMessage: e,
		};
	}
};

const connectToHardwareWallet = (networkId, networkName, walletType) => {
	return {
		walletType,
		unlocked: true,
		networkId,
		networkName: networkName.toLowerCase(),
	};
};

const connectToWalletConnect = async (networkId, networkName) => {
	const walletState = {
		walletType: SUPPORTED_WALLETS_MAP.WALLET_CONNECT,
		unlocked: false,
	};
	try {
		await snxJSConnector.signer.provider._web3Provider.enable();
		const accounts = await snxJSConnector.signer.getNextAddresses();
		if (accounts && accounts.length > 0) {
			return {
				...walletState,
				currentWallet: accounts[0],
				unlocked: true,
				networkId,
				networkName: networkName.toLowerCase(),
			};
		}
	} catch (e) {
		console.log(e);
		return {
			...walletState,
			unlockReason: 'ErrorWhileConnectingToWalletConnect',
			unlockMessage: e,
		};
	}
};

const connectToPortis = async (networkId, networkName) => {
	const walletState = {
		walletType: SUPPORTED_WALLETS_MAP.PORTIS,
		unlocked: false,
	};
	try {
		const accounts = await snxJSConnector.signer.getNextAddresses();
		if (accounts && accounts.length > 0) {
			return {
				...walletState,
				currentWallet: accounts[0],
				unlocked: true,
				networkId,
				networkName: networkName.toLowerCase(),
			};
		}
	} catch (e) {
		console.log(e);
		return {
			...walletState,
			unlockError: e.message,
		};
	}
};

const getSignerConfig = ({ type, networkId, derivationPath, networkName }) => {
	if (type === SUPPORTED_WALLETS_MAP.LEDGER) {
		const DEFAULT_LEDGER_DERIVATION_PATH = "44'/60'/0'/";
		return { derivationPath: derivationPath || DEFAULT_LEDGER_DERIVATION_PATH };
	}
	if (type === SUPPORTED_WALLETS_MAP.COINBASE) {
		return {
			appName: 'Mintr',
			appLogoUrl: `${window.location.origin}/images/mintr-leaf-logo.png`,
			jsonRpcUrl: 'https://goerli.optimism.io',
			networkId,
		};
	}
	// if (type === SUPPORTED_WALLETS_MAP.WALLET_CONNECT) {
	// 	return {
	// 		infuraId: process.env.REACT_APP_INFURA_PROJECT_ID,
	// 	};
	// }
	// if (type === SUPPORTED_WALLETS_MAP.PORTIS) {
	// 	return {
	// 		networkName: networkName.toLowerCase(),
	// 		appId: PORTIS_APP_ID,
	// 	};
	// }

	return {};
};

export const setSigner = async ({ type, networkId, derivationPath, networkName }) => {
	const signer = new snxJSConnector.signers[type](
		getSignerConfig({ type, networkId, derivationPath, networkName })
	);

	snxJSConnector.setContractSettings({
		networkId,
		signer,
		provider: signer.provider,
	});
};

export const connectToWallet = async ({ wallet, derivationPath }) => {
	const { name, networkId } = await getEthereumNetwork();
	if (!name) {
		return {
			walletType: '',
			unlocked: false,
			unlockReason: 'NetworkNotSupported',
		};
	}
	setSigner({ type: wallet, networkId, derivationPath, networkName: name });

	switch (wallet) {
		case SUPPORTED_WALLETS_MAP.METAMASK:
			return connectToMetamask(networkId, name);
		case SUPPORTED_WALLETS_MAP.COINBASE:
			return connectToCoinbase(networkId, name);
		case SUPPORTED_WALLETS_MAP.TREZOR:
		case SUPPORTED_WALLETS_MAP.LEDGER:
			return connectToHardwareWallet(networkId, name, wallet);
		case SUPPORTED_WALLETS_MAP.WALLET_CONNECT:
			return connectToWalletConnect(networkId, name);
		case SUPPORTED_WALLETS_MAP.PORTIS:
			return connectToPortis(networkId, name);
		default:
			return {};
	}
};

export default snxJSConnector;
