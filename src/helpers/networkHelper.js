const GWEI_UNIT = 1000000000;

export const SUPPORTED_NETWORKS = {
  1: 'MAINNET',
  3: 'ROPSTEN',
  4: 'RINKEBY',
  42: 'KOVAN',
};

export const SUPPORTED_WALLETS = ['Metamask', 'Trezor', 'Ledger'];

export const hasWeb3 = () => {
  return window.web3;
};

export async function getEthereumNetwork() {
  return await new Promise(function(resolve, reject) {
    if (!window.web3) resolve({ name: 'MAINNET', networkId: '1' });
    window.web3.version.getNetwork((err, networkId) => {
      if (err) {
        reject(err);
      } else {
        const name = SUPPORTED_NETWORKS[networkId];
        resolve({ name, networkId });
      }
    });
  });
}

export const getNetworkInfo = async () => {
  const result = await fetch('https://ethgasstation.info/json/ethgasAPI.json');
  const networkInfo = await result.json();
  return {
    slow: {
      gwei: networkInfo.safeLow / 10,
      time: networkInfo.safeLowWait,
      getPrice: (ethPrice, gasLimit) =>
        ((networkInfo.safeLow / 10) * ethPrice * gasLimit) / GWEI_UNIT,
    },
    average: {
      gwei: networkInfo.average / 10,
      time: networkInfo.avgWait,
      getPrice: (ethPrice, gasLimit) =>
        ((networkInfo.average / 10) * ethPrice * gasLimit) / GWEI_UNIT,
    },
    fast: {
      gwei: networkInfo.fast / 10,
      time: networkInfo.fastWait,
      getPrice: (ethPrice, gasLimit) =>
        ((networkInfo.fast / 10) * ethPrice * gasLimit) / GWEI_UNIT,
    },
  };
};

export const getTransactionPrice = (gasPrice, gasLimit, ethPrice) => {
  return (gasPrice * ethPrice * gasLimit) / GWEI_UNIT;
};
