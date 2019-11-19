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
			return { ...state, derivationPath: action.payload };
		}
		default:
			return state;
	}
};

// Actions
export const setDerivationPath = (path, dispatch) => {
	return dispatch({
		type: SET_DERIVATION_PATH,
		payload: path,
	});
};
export const updateWalletStatus = (walletStatus, dispatch) => {
	return dispatch({
		type: UPDATE_WALLET_STATUS,
		payload: walletStatus,
	});
};

export const updateWalletPaginatorIndex = (index, dispatch) => {
	return dispatch({
		type: UPDATE_WALLET_PAGINATOR_INDEX,
		payload: index,
	});
};
