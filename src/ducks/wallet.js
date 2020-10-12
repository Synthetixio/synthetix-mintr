import { setSigner } from '../helpers/snxJSConnector';
import { getAddress } from '../helpers/formatters';

const UPDATE_WALLET_STATUS = 'WALLET/UPDATE_WALLET_STATUS';
const UPDATE_WALLET_PAGINATOR_INDEX = 'WALLET/UPDATE_WALLET_PAGINATOR_INDEX';
const SET_DERIVATION_PATH = 'WALLET/SET_DERIVATION_PATH';

const defaultState = {
	unlocked: false,
	walletPaginatorIndex: 0,
	availableWallets: [],
	derivationPath: localStorage.getItem('derivationPath'),
};

// Reducer
export default (state = defaultState, action) => {
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
const setDerivationPath = path => {
	return {
		type: SET_DERIVATION_PATH,
		payload: path,
	};
};
export const derivationPathChange = (signerOptions, derivationPath) => {
	setSigner(signerOptions);
	localStorage.setItem('derivationPath', derivationPath);
	return setDerivationPath(derivationPath);
};
export const updateWalletStatus = walletStatus => {
	let payload = walletStatus;
	if (walletStatus.currentWallet) {
		payload.currentWallet = getAddress(walletStatus.currentWallet);
	}
	return {
		type: UPDATE_WALLET_STATUS,
		payload,
	};
};

export const updateWalletPaginatorIndex = index => {
	return {
		type: UPDATE_WALLET_PAGINATOR_INDEX,
		payload: index,
	};
};

export const getWalletDetails = state => state.wallet;

export const getCurrentWallet = state => state.wallet.currentWallet;

export const getCurrentNetworkId = state => state.wallet.networkId;
