import { SynthetixJs } from 'synthetix-js';
import {
	getEthereumNetwork,
	INFURA_JSON_RPC_URLS,
	SUPPORTED_WALLETS_MAP,
	PORTIS_APP_ID,
} from './networkHelper';
import { ethers } from 'ethers';
import {
	uniswapV1,
	uniswapV2,
	unipoolSETH,
	unipoolSXAU,
	curvepool,
	curveLPToken,
	synthSummary,
	oldCurvepool,
	iEthRewards,
	balancerpool,
	balancerSNXRewards,
	curveSBTC,
	sBTCRewards,
	curveSUSDSwapContract,
} from './contracts';

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
		if (this.signer) {
			this.uniswapV1Contract = new ethers.Contract(uniswapV1.address, uniswapV1.abi, this.signer);
			this.uniswapV2Contract = new ethers.Contract(uniswapV2.address, uniswapV2.abi, this.signer);
			this.unipoolSETHContract = new ethers.Contract(
				unipoolSETH.address,
				unipoolSETH.abi,
				this.signer
			);
			this.unipoolSXAUContract = new ethers.Contract(
				unipoolSXAU.address,
				unipoolSXAU.abi,
				this.signer
			);
			this.curveLPTokenContract = new ethers.Contract(
				curveLPToken.address,
				curveLPToken.abi,
				this.signer
			);
			this.curvepoolContract = new ethers.Contract(curvepool.address, curvepool.abi, this.signer);
			this.oldCurvepoolContract = new ethers.Contract(
				oldCurvepool.address,
				curvepool.abi,
				this.signer
			);
			this.iEthRewardsContract = new ethers.Contract(
				iEthRewards.address,
				iEthRewards.abi,
				this.signer
			);
			this.balancerpoolContract = new ethers.Contract(
				balancerpool.address,
				balancerpool.abi,
				this.signer
			);
			this.balancerSNXRewardsContract = new ethers.Contract(
				balancerSNXRewards.address,
				balancerSNXRewards.abi,
				this.signer
			);
			this.curveSBTCContract = new ethers.Contract(curveSBTC.address, curveSBTC.abi, this.signer);
			this.sBTCRewardsContract = new ethers.Contract(
				sBTCRewards.address,
				sBTCRewards.abi,
				this.signer
			);
		}
		this.synthSummaryUtilContract = new ethers.Contract(
			synthSummary.addresses[contractSettings.networkId],
			synthSummary.abi,
			this.provider
		);
		this.curveSUSDSwapContract = new ethers.Contract(
			curveSUSDSwapContract.address,
			curveSUSDSwapContract.abi,
			this.provider
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
			jsonRpcUrl: INFURA_JSON_RPC_URLS[networkId],
			networkId,
		};
	}
	if (type === SUPPORTED_WALLETS_MAP.WALLET_CONNECT) {
		return {
			infuraId: process.env.REACT_APP_INFURA_PROJECT_ID,
		};
	}
	if (type === SUPPORTED_WALLETS_MAP.PORTIS) {
		return {
			networkName: networkName.toLowerCase(),
			appId: PORTIS_APP_ID,
		};
	}

	return {};
};

export const setSigner = ({ type, networkId, derivationPath, networkName }) => {
	const signer = new snxJSConnector.signers[type](
		getSignerConfig({ type, networkId, derivationPath, networkName })
	);

	snxJSConnector.setContractSettings({
		networkId,
		signer,
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
