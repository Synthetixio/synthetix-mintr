/* eslint-disable */
const USER_DENIED = 'User denied transaction signature.';

const ERROR_CODES = {
  Metamask: {
    '-32603': USER_DENIED,
  },
  Ledger: {
    '27013': USER_DENIED,
  },
  Trezor: {},
  Coinbase: {
    '-32603': USER_DENIED,
  },
};

export default (error, walletType) => {
  const code = (error.code || error.statusCode).toString();
  if (!code || !ERROR_CODES[walletType][code]) {
    return { message: error.message || 'Error' };
  }
  return { code, message: ERROR_CODES[walletType][code] };
};
