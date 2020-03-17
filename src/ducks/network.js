import { createSlice } from '@reduxjs/toolkit';
import { getNetworkSpeed } from '../helpers/networkHelper';
import { GWEI_UNIT } from '../constants/network';

import { NETWORK_SPEEDS_TO_KEY } from '../constants/network';

export const networkSlice = createSlice({
	name: 'network',
	initialState: {
		isFetching: false,
		isFetched: false,
		isRefreshing: false,
		fetchError: null,
		gasPrices: null,
		currentGasPrice: null,
	},
	reducers: {
		fetchGasPricesRequest: state => {
			state.fetchError = null;
			state.isFetching = true;
			if (state.isFetched) {
				state.isRefreshing = true;
			}
		},
		fetchGasPricesFailure: (state, action) => {
			state.fetchError = action.payload.error;
			state.isFetching = false;
			state.isRefreshing = false;
		},
		fetchGasPricesSuccess: (state, action) => {
			const gasPrices = action.payload;
			state.gasPrices = gasPrices;
			if (gasPrices?.[NETWORK_SPEEDS_TO_KEY.AVERAGE]) {
				const { price, time } = gasPrices[NETWORK_SPEEDS_TO_KEY.AVERAGE];
				state.currentGasPrice = {
					price,
					formattedPrice: price * GWEI_UNIT,
					time,
				};
			}
			state.isFetching = false;
			state.isRefreshing = false;
			state.isFetched = true;
		},
		setGasPrice: (state, action) => {
			const price = action.payload;
			state.currentGasPrice = {
				price,
				formattedPrice: price * GWEI_UNIT,
			};
		},
		// fetchingGasLimit: state => {
		// 	state.blah = 1;
		// },
		// updateGasLimit: state => {
		// 	state.blah = 1;
		// },
		// updateGasPrice: state => {
		// 	state.blah = 1;
		// },
	},
});

const {
	fetchGasPricesRequest,
	fetchGasPricesFailure,
	fetchGasPricesSuccess,
	fetchingGasLimit,
	updateGasLimit,
	updateGasPrice,
	setGasPrice,
} = networkSlice.actions;
export { fetchingGasLimit, updateGasLimit, updateGasPrice, setGasPrice };
const getNetworkState = state => state.network;

export const getNetworkInfo = state => getNetworkState(state).networkInfo;
export const getNetworkSettings = state => getNetworkState(state).networkInfo;
export const getCurrentGasPrice = state => getNetworkState(state).currentGasPrice;
export const getNetworkPrices = state => getNetworkState(state).gasPrices;

export const fetchGasPrices = () => async dispatch => {
	try {
		dispatch(fetchGasPricesRequest());
		const networkSpeed = await getNetworkSpeed();
		dispatch(fetchGasPricesSuccess(networkSpeed));
	} catch (e) {
		dispatch(fetchGasPricesFailure({ error: e.message }));
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
