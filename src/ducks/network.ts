import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { takeLatest, put } from 'redux-saga/effects';
import { getNetworkSpeeds, formatGasPrice } from '../helpers/networkHelper';

import { NETWORK_SPEEDS_TO_KEY } from '../constants/network';
import { RootState } from './types';

const DEFAULT_GAS_PRICE = 30;

export type NetworkSliceState = {
	isFetching: boolean;
	isFetched: boolean;
	isRefreshing: boolean;
	fetchError: string | null;
	networkSpeeds: NetworkSpeeds | null;
	currentGasPrice: GasPrice | null;
};

export type NetworkSpeeds = Record<string, GasPrice>;

export type GasPrice = {
	price: number;
	formattedPrice: number;
	time: number | null;
};

const initialState: NetworkSliceState = {
	isFetching: false,
	isFetched: false,
	isRefreshing: false,
	fetchError: null,
	networkSpeeds: null,
	currentGasPrice: {
		price: DEFAULT_GAS_PRICE,
		formattedPrice: formatGasPrice(DEFAULT_GAS_PRICE),
		time: 0,
	},
};

const sliceName = 'network';

export const networkSlice = createSlice({
	name: sliceName,
	initialState,
	reducers: {
		fetchGasPricesRequest: state => {
			state.fetchError = null;
			state.isFetching = true;
			if (state.isFetched) {
				state.isRefreshing = true;
			}
		},
		fetchGasPricesFailure: (state, action: PayloadAction<{ error: string }>) => {
			state.fetchError = action.payload.error;
			state.isFetching = false;
			state.isRefreshing = false;
		},
		fetchGasPricesSuccess: (
			state,
			action: PayloadAction<{ networkSpeeds: NetworkSpeeds; defaultSpeed: GasPrice }>
		) => {
			state.networkSpeeds = action.payload.networkSpeeds;
			state.currentGasPrice = action.payload.defaultSpeed;
			state.isFetching = false;
			state.isRefreshing = false;
			state.isFetched = true;
		},
		setCurrentGasPrice: (state, action: PayloadAction<{ gasPrice: number; time: number }>) => {
			const { gasPrice, time } = action.payload;
			state.currentGasPrice = {
				price: gasPrice,
				formattedPrice: formatGasPrice(gasPrice),
				time: time,
			};
		},
	},
});

export const {
	fetchGasPricesRequest,
	fetchGasPricesFailure,
	fetchGasPricesSuccess,
	setCurrentGasPrice,
} = networkSlice.actions;

const getNetworkState = (state: RootState) => state[sliceName];
export const getCurrentGasPrice = (state: RootState) => getNetworkState(state).currentGasPrice;
export const getNetworkPrices = (state: RootState) => getNetworkState(state).networkSpeeds;

function* fetchGasPrices() {
	try {
		const networkSpeeds = yield getNetworkSpeeds();
		const fastSpeed = networkSpeeds[NETWORK_SPEEDS_TO_KEY.FAST];
		const defaultSpeed = { ...fastSpeed, formattedPrice: formatGasPrice(fastSpeed.price) };
		yield put(fetchGasPricesSuccess({ networkSpeeds, defaultSpeed }));
		return true;
	} catch (e) {
		yield put(fetchGasPricesFailure({ error: e.message }));
		return false;
	}
}

export function* watchFetchNetworkRequest() {
	yield takeLatest(fetchGasPricesRequest.type, fetchGasPrices);
}
export default networkSlice.reducer;
