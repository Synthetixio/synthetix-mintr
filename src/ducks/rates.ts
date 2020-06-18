import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { takeLatest, put } from 'redux-saga/effects';

import { RootState } from './types';
import { CRYPTO_CURRENCY_TO_KEY } from 'constants/currency';
import { getExchangeRates } from 'dataFetcher';

export type Rates = Record<string, number>;

export type RateSliceState = {
	rates: Rates | null;
	isFetching: boolean;
	isFetched: boolean;
	isRefreshing: boolean;
	fetchError: string | null;
};

const initialState: RateSliceState = {
	rates: null,
	isFetching: false,
	isFetched: false,
	isRefreshing: false,
	fetchError: null,
};

const sliceName = 'rates';

export const appSlice = createSlice({
	name: sliceName,
	initialState,
	reducers: {
		fetchRatesRequest: state => {
			state.fetchError = null;
			state.isFetching = true;
			if (state.isFetched) {
				state.isRefreshing = true;
			}
		},
		fetchRatesFailure: (state, action: PayloadAction<{ error: string }>) => {
			state.fetchError = action.payload.error;
			state.isFetching = false;
			state.isRefreshing = false;
		},
		fetchRatesSuccess: (state, action: PayloadAction<{ rates: Rates }>) => {
			state.rates = action.payload.rates;
			state.isFetching = false;
			state.isRefreshing = false;
			state.isFetched = true;
		},
	},
});

export const { fetchRatesRequest, fetchRatesFailure, fetchRatesSuccess } = appSlice.actions;

const getRatesState = (state: RootState) => state.rates;

export const getEthRate = (state: RootState) =>
	getRatesState(state).rates && getRatesState(state).rates![CRYPTO_CURRENCY_TO_KEY.ETH];
export const getSNXRate = (state: RootState) =>
	getRatesState(state).rates && getRatesState(state).rates![CRYPTO_CURRENCY_TO_KEY.SNX];
export const getSUSDRate = (state: RootState) =>
	getRatesState(state).rates && getRatesState(state).rates![CRYPTO_CURRENCY_TO_KEY.sUSD];
export const getRates = (state: RootState) => getRatesState(state).rates;

function* fetchRates() {
	try {
		const rates = yield getExchangeRates();
		yield put(fetchRatesSuccess({ rates }));
		return true;
	} catch (e) {
		yield put(fetchRatesFailure({ error: e.message }));
		return false;
	}
}

export function* watchFetchRatesRequest() {
	yield takeLatest(fetchRatesRequest.type, fetchRates);
}

export default appSlice.reducer;
