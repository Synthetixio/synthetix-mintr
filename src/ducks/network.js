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
	},
});

const {
	fetchGasPricesRequest,
	fetchGasPricesFailure,
	fetchGasPricesSuccess,
	updateGasPrice,
	setGasPrice,
} = networkSlice.actions;
export { updateGasPrice, setGasPrice };
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
