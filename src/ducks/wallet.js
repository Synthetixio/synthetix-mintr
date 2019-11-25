import { setSigner } from '../helpers/snxJSConnector';
import { getAddress } from '../helpers/formatters';

const UPDATE_WALLET_STATUS = 'WALLET/UPDATE_WALLET_STATUS';
const UPDATE_WALLET_PAGINATOR_INDEX = 'WALLET/UPDATE_WALLET_PAGINATOR_INDEX';
const SET_DERIVATION_PATH = 'WALLET/SET_DERIVATION_PATH';

// Reducer
export default (state, action) => {
	switch (action.type) {
		case UPDATE_WALLET_STATUS: {
			return { ...state, ...action.payload };
		}
		case UPDATE_WALLET_PAGINATOR_INDEX: {
			return { ...state, walletPaginatorIndex: action.payload };
		}
		case SET_DERIVATION_PATH: {
			return {
				...state,
				derivationPath: action.payload,
				availableWallets: [],
				walletPaginatorIndex: 0,
			};
		}
		default:
			return state;
	}
};

// Actions
const setDerivationPath = (path, dispatch) => {
	return dispatch({
		type: SET_DERIVATION_PATH,
		payload: path,
	});
};
export const derivationPathChange = (signerOptions, derivationPath, dispatch) => {
	setSigner(signerOptions);
	localStorage.setItem('derivationPath', derivationPath);
	return setDerivationPath(derivationPath, dispatch);
};
export const updateWalletStatus = (walletStatus, dispatch) => {
	return dispatch({
		type: UPDATE_WALLET_STATUS,
		payload: {
			...walletStatus,
			currentWallet: walletStatus.currentWallet ? getAddress(walletStatus.currentWallet) : null,
		},
	});
};

export const updateWalletPaginatorIndex = (index, dispatch) => {
	return dispatch({
		type: UPDATE_WALLET_PAGINATOR_INDEX,
		payload: index,
	});
};
