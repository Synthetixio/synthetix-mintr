import { SynthetixJs } from 'synthetix-js';
import { getEthereumNetwork } from './networkHelper';

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

const connectToMetamask = async (networkId, name, signer) => {
  try {
    // Otherwise we enable ethereum if needed (modern browsers)
    if (window.ethereum) {
      window.ethereum.autoRefreshOnNetworkChange = true;
      await window.ethereum.enable();
    }
    // And we set the connector with the latest details
    snxJSConnector.setContractSettings({
      networkId,
      provider: snxJSConnector.snxJS.ethers.getDefaultProvider(
        name && name.toLowerCase()
      ),
      signer: signer,
    });
    const accounts = await snxJSConnector.signer.getNextAddresses();
    if (accounts && accounts.length > 0) {
      return {
        currentWallet: accounts[0],
        availableWallets: accounts,
        walletType: 'Metamask',
        unlocked: true,
        networkId,
        networkName: name.toLowerCase(),
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

const connectToHardwareWallet = type => {
  return {
    walletType: type,
    unlocked: true,
    networkId: 1,
    networkName: 'mainnet',
  };
};

export const connectToWallet = async type => {
  const { name, networkId } = await getEthereumNetwork();
  // If current network is not supported, we show an error
  if (!name) {
    // updateWalletStatus => error
    return {
      walletType: 'Metamask',
      unlocked: false,
      unlockReason: 'NetworkNotSupported',
    };
  }
  const signer = new snxJSConnector.signers[type]();
  snxJSConnector.setContractSettings({
    networkId,
    signer,
  });
  switch (type) {
    case 'Metamask':
      return connectToMetamask(networkId, name, signer);
    case 'Trezor':
    case 'Ledger':
      return connectToHardwareWallet(type);
    default:
      return null;
  }
};

export default snxJSConnector;
