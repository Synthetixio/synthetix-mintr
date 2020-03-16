import { createSlice } from '@reduxjs/toolkit';
import snxJSConnector from '../helpers/snxJSConnector';
import { CRYPTO_CURRENCY_TO_KEY } from '../constants/currency';
import { bytesFormatter, bigNumberFormatter } from '../helpers/formatters';

export const appSlice = createSlice({
	name: 'rates',
	initialState: {
		rates: {},
		isFetching: false,
		isFetched: false,
		isRefreshing: false,
		fetchError: null,
	},
	reducers: {
		setAppReady: state => {
			state.isReady = true;
		},
		fetchRatesRequest: state => {
			state.fetchError = null;
			state.isFetching = true;
			if (state.isFetched) {
				state.isRefreshing = true;
			}
		},
		fetchRatesFailure: (state, action) => {
			state.fetchError = action.payload.error;
			state.isFetching = false;
			state.isRefreshing = false;
		},
		fetchRatesSuccess: (state, action) => {
			state.rates = action.payload;
			state.isFetching = false;
			state.isRefreshing = false;
			state.isFetched = true;
		},
	},
});

const { setAppReady, fetchRatesRequest, fetchRatesFailure, fetchRatesSuccess } = appSlice.actions;

const getRatesState = state => state.rates;
export const getEthRate = state => getRatesState(state).rates[CRYPTO_CURRENCY_TO_KEY.ETH];
export const getAppIsReady = state => getRatesState(state).isReady;
export const getAppIsOnMaintenance = state => getRatesState(state).isOnMaintenance;

export const fetchRates = () => async dispatch => {
	try {
		const { ExchangeRates } = snxJSConnector.snxJS;
		dispatch(fetchRatesRequest());
		const ethRate = await ExchangeRates.rateForCurrency(bytesFormatter(CRYPTO_CURRENCY_TO_KEY.ETH));
		dispatch(fetchRatesSuccess({ [CRYPTO_CURRENCY_TO_KEY.ETH]: bigNumberFormatter(ethRate) }));
	} catch (e) {
		dispatch(fetchRatesFailure({ error: e.message }));
	}
};

export { setAppReady };

export default appSlice.reducer;
