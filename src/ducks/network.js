import { createSlice } from '@reduxjs/toolkit';
import { getTransactionPrice, getNetworkSpeed } from '../helpers/networkHelper';
import { GAS_LIMIT_BUFFER } from '../constants/network';

export const networkSlice = createSlice({
	name: 'network',
	initialState: {
		isFetching: false,
		isFetched: false,
		isRefreshing: false,
		fetchError: null,
		networkInfo: null,
	},
	reducers: {
		fetchNetworkInfoRequest: state => {
			state.fetchError = null;
			state.isFetching = true;
			if (state.isFetched) {
				state.isRefreshing = true;
			}
		},
		fetchNetworkInfoFailure: (state, action) => {
			state.fetchError = action.payload.error;
			state.isFetching = false;
			state.isRefreshing = false;
		},
		fetchNetworkInfoSuccess: (state, action) => {
			state.networkInfo = action.payload;
			state.isFetching = false;
			state.isRefreshing = false;
			state.isFetched = true;
		},
		fetchingGasLimit: state => {
			state.blah = 1;
		},
		updateGasLimit: state => {
			state.blah = 1;
		},
		updateGasPrice: state => {
			state.blah = 1;
		},
	},
});

const {
	fetchNetworkInfoRequest,
	fetchNetworkInfoFailure,
	fetchNetworkInfoSuccess,
	fetchingGasLimit,
	updateGasLimit,
	updateGasPrice,
} = networkSlice.actions;
export { fetchingGasLimit, updateGasLimit, updateGasPrice };
const getNetworkState = state => state.network;

export const getNetworkInfo = state => getNetworkState(state).networkInfo;
export const getNetworkSettings = state => getNetworkState(state).networkInfo;

export const fetchNetworkInfo = () => async dispatch => {
	try {
		dispatch(fetchNetworkInfoRequest());
		const networkSpeed = await getNetworkSpeed();
		dispatch(fetchNetworkInfoSuccess(networkSpeed));
	} catch (e) {
		dispatch(fetchNetworkInfoFailure({ error: e.message }));
	}
};

export default networkSlice.reducer;

// // Reducer
// export default (state = defaultState, action) => {
// 	switch (action.type) {
// 		case UPDATE_INFO: {
// 			const { gasStation, ethPrice } = action.payload;
// 			return {
// 				...state,
// 				gasStation,
// 				ethPrice,
// 				settings: { gasPrice: gasStation['average'].gwei },
// 			};
// 		}
// 		case FETCHING_GAS_LIMIT: {
// 			return {
// 				...state,
// 				settings: {
// 					...state.settings,
// 					isFetchingGasLimit: true,
// 					transactionUsdPrice: null,
// 					gasLimit: null,
// 				},
// 			};
// 		}
// 		case UPDATE_GAS_LIMIT: {
// 			const {
// 				ethPrice,
// 				settings: { gasPrice },
// 			} = state;
// 			const gasLimit = action.payload + GAS_LIMIT_BUFFER;
// 			const transactionUsdPrice = getTransactionPrice(gasPrice, gasLimit, ethPrice);
// 			return {
// 				...state,
// 				settings: {
// 					...state.settings,
// 					gasLimit,
// 					transactionUsdPrice,
// 					isFetchingGasLimit: false,
// 				},
// 			};
// 		}
// 		case UPDATE_GAS_PRICE: {
// 			const {
// 				ethPrice,
// 				settings: { gasLimit },
// 			} = state;
// 			const gasPrice = action.payload;
// 			const transactionUsdPrice = getTransactionPrice(gasPrice, gasLimit, ethPrice);
// 			return {
// 				...state,
// 				settings: {
// 					...state.settings,
// 					gasPrice: action.payload,
// 					transactionUsdPrice,
// 				},
// 			};
// 		}
// 		default:
// 			return state;
// 	}
// };

// // Actions
// export const updateEthPrice = price => {
// 	return {
// 		type: UPDATE_ETH_PRICE,
// 		payload: price,
// 	};
// };

// export const updateNetworkInfo = (gasStation, ethPrice) => {
// 	return {
// 		type: UPDATE_INFO,
// 		payload: { gasStation, ethPrice },
// 	};
// };

// export const updateGasLimit = gasLimit => {
// 	return {
// 		type: UPDATE_GAS_LIMIT,
// 		payload: gasLimit,
// 	};
// };

// export const updateGasPrice = gasPrice => {
// 	return {
// 		type: UPDATE_GAS_PRICE,
// 		payload: gasPrice,
// 	};
// };

// export const fetchingGasLimit = () => {
// 	return {
// 		type: FETCHING_GAS_LIMIT,
// 	};
// };

// export const getNetworkSettings = state => state.network.settings;
// export const getNetworkDetails = state => state.network;
