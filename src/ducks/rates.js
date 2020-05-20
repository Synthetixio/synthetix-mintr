import { createSlice } from '@reduxjs/toolkit';
import snxJSConnector from '../helpers/snxJSConnector';
import { CRYPTO_CURRENCY_TO_KEY } from '../constants/currency';
import { parseBytes32String, bytesFormatter } from '../helpers/formatters';

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

const { fetchRatesRequest, fetchRatesFailure, fetchRatesSuccess } = appSlice.actions;

const getRatesState = state => state.rates;

export const getEthRate = state => getRatesState(state).rates[CRYPTO_CURRENCY_TO_KEY.ETH];
export const getSNXRate = state => getRatesState(state).rates[CRYPTO_CURRENCY_TO_KEY.SNX];
export const getRates = state => getRatesState(state).rates;
export const fetchRates = () => async dispatch => {
	const {
		synthSummaryUtilContract,
		snxJS: { ExchangeRates },
	} = snxJSConnector;
	dispatch(fetchRatesRequest());
	try {
		const [synthsRates, snxRate] = await Promise.all([
			synthSummaryUtilContract.synthsRates(),
			ExchangeRates.rateForCurrency(bytesFormatter(CRYPTO_CURRENCY_TO_KEY.SNX)),
		]);
		let exchangeRates = {
			[CRYPTO_CURRENCY_TO_KEY.SNX]: snxRate / 1e18,
		};
		const [keys, rates] = synthsRates;
		keys.forEach((key, i) => {
			const synthName = parseBytes32String(key);
			exchangeRates[synthName] = rates[i] / 1e18;
		});
		dispatch(fetchRatesSuccess(exchangeRates));
	} catch (e) {
		dispatch(fetchRatesFailure({ error: e.message }));
	}
};

export default appSlice.reducer;
