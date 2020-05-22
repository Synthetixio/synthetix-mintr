import axios from 'axios';
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

const fetchUniswapSETHRate = async () => {
	const {
		snxJS: { sETH },
	} = snxJSConnector;
	const DEFAULT_RATE = 1;

	try {
		const sETHAddress = sETH.contract.address;
		const query = `query {
			exchanges(where: {tokenAddress:"${sETHAddress}"}) {
				price
			}
		}`;

		const response = await axios.post(
			'https://api.thegraph.com/subgraphs/name/graphprotocol/uniswap',
			JSON.stringify({ query, variables: null })
		);

		return (
			(response.data &&
				response.data.data &&
				response.data.data.exchanges &&
				response.data.data.exchanges[0] &&
				1 / response.data.data.exchanges[0].price) ||
			DEFAULT_RATE
		);
	} catch (e) {
		// if we can't get the sETH/ETH rate, then default it to 1:1
		return DEFAULT_RATE;
	}
};

export const fetchRates = () => async dispatch => {
	const {
		synthSummaryUtilContract,
		snxJS: { ExchangeRates },
	} = snxJSConnector;
	dispatch(fetchRatesRequest());
	try {
		const [synthsRates, snxRate, uniswapSETHRate] = await Promise.all([
			synthSummaryUtilContract.synthsRates(),
			ExchangeRates.rateForCurrency(bytesFormatter(CRYPTO_CURRENCY_TO_KEY.SNX)),
			fetchUniswapSETHRate(),
		]);

		let exchangeRates = {
			[CRYPTO_CURRENCY_TO_KEY.SNX]: snxRate / 1e18,
		};
		const [keys, rates] = synthsRates;
		keys.forEach((key, i) => {
			const synthName = parseBytes32String(key);
			const rate = rates[i] / 1e18;
			if (synthName === CRYPTO_CURRENCY_TO_KEY.sUSD) {
				exchangeRates[CRYPTO_CURRENCY_TO_KEY.sUSD] = uniswapSETHRate;
			} else if (synthName === CRYPTO_CURRENCY_TO_KEY.sETH) {
				exchangeRates[CRYPTO_CURRENCY_TO_KEY.sETH] = rate;
				exchangeRates[CRYPTO_CURRENCY_TO_KEY.ETH] = rate;
			} else {
				exchangeRates[synthName] = rate;
			}
		});
		dispatch(fetchRatesSuccess(exchangeRates));
	} catch (e) {
		dispatch(fetchRatesFailure({ error: e.message }));
	}
};

export default appSlice.reducer;
