import { SynthetixJs } from 'synthetix-js';
import { getEthereumNetwork, INFURA_JSON_RPC_URLS } from './networkHelper';

let snxJSConnector = {
	initialized: false,
	signers: SynthetixJs.signers,
	setContractSettings: function(contractSettings) {
		this.initialized = true;
		this.snxJS = new SynthetixJs(contractSettings);
		this.synths = this.snxJS.contractSettings.synths;
		this.signer = this.snxJS.contractSettings.signer;
		this.provider = this.snxJS.contractSettings.provider;
		this.utils = this.snxJS.utils;
		this.ethersUtils = this.snxJS.ethers.utils;
	},
};

const connectToMetamask = async (networkId, networkName) => {
	try {
		// Otherwise we enable ethereum if needed (modern browsers)
		if (window.ethereum) {
			window.ethereum.autoRefreshOnNetworkChange = true;
			await window.ethereum.enable();
		}
		const accounts = await snxJSConnector.signer.getNextAddresses();
		if (accounts && accounts.length > 0) {
			return {
				currentWallet: accounts[0],
				availableWallets: accounts,
				walletType: 'Metamask',
				unlocked: true,
				networkId,
				networkName: networkName.toLowerCase(),
			};
		} else {
			return {
				walletType: 'Metamask',
				unlocked: false,
				unlockReason: 'MetamaskNoAccounts',
			};
		}
		// We updateWalletStatus with all the infos
	} catch (e) {
		console.log(e);
		return {
			walletType: 'Metamask',
			unlocked: false,
			unlockReason: 'ErrorWhileConnectingToMetamask',
			unlockMessage: e,
		};
	}
};

const connectToCoinbase = async (networkId, networkName) => {
	try {
		const accounts = await snxJSConnector.signer.getNextAddresses();
		if (accounts && accounts.length > 0) {
			return {
				currentWallet: accounts[0],
				availableWallets: accounts,
				walletType: 'Coinbase',
				unlocked: true,
				networkId: 1,
				networkName: networkName.toLowerCase(),
			};
		} else {
			return {
				walletType: 'Coinbase',
				unlocked: false,
				unlockReason: 'CoinbaseNoAccounts',
			};
		}
		// We updateWalletStatus with all the infos
	} catch (e) {
		console.log(e);
		return {
			walletType: 'Coinbase',
			unlocked: false,
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

export const connectToWallet = async type => {
	const { name, networkId } = await getEthereumNetwork();
	if (!name) {
		// updateWalletStatus => error
		return {
			walletType: '',
			unlocked: false,
			unlockReason: 'NetworkNotSupported',
		};
	}

	const signerConfig =
		type === 'Coinbase'
			? {
					appName: 'Mintr',
					appLogoUrl: `${window.location.origin}/images/mintr-leaf-logo.png`,
					jsonRpcUrl: INFURA_JSON_RPC_URLS[networkId],
					networkId,
			  }
			: {};

	const signer = new snxJSConnector.signers[type](signerConfig);

	snxJSConnector.setContractSettings({
		networkId,
		signer,
	});

	switch (type) {
		case 'Metamask':
			return connectToMetamask(networkId, name);
		case 'Coinbase':
			return connectToCoinbase(networkId, name);
		case 'Trezor':
		case 'Ledger':
			return connectToHardwareWallet(networkId, name, type);
		default:
			return {};
	}
};

export default snxJSConnector;
