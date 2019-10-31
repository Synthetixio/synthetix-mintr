/* eslint-disable */
const USER_DENIED = 'transactionProcessing.error.type.userDenied';

const ERROR_CODES = {
	Metamask: {
		'-32603': USER_DENIED,
		'4001': USER_DENIED,
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
		return { message: error.message || 'transactionProcessing.error.type.generic' };
	}
	return { code, message: ERROR_CODES[walletType][code] };
};
