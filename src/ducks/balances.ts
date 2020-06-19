import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { takeLatest, put, select } from 'redux-saga/effects';
import isEmpty from 'lodash/isEmpty';
import orderBy from 'lodash/orderBy';
import { CRYPTO_CURRENCY_TO_KEY } from '../constants/currency';
import { getRates } from './rates';
import { getCurrentWallet } from './wallet';
import { getBalances } from 'dataFetcher';
import { RootState } from './types';

export type Balances = Record<string, number>;

export type CurrencyKey = string;

export type BalanceWithRates = {
	balance: number;
	valueUSD: number;
};

type SynthBalances = Balances[];

type BalancesSliceState = {
	crypto: Balances | null;
	synths: SynthBalances | null;
	totalSynths: number | null;
	isFetching: boolean;
	isFetched: boolean;
	isRefreshing: boolean;
	fetchError: string | null;
};

type CryptoBalanceWithRates = Record<CurrencyKey, BalanceWithRates>;
type SynthsBalanceWithRates = BalanceWithRates & { name: string };

const initialState: BalancesSliceState = {
	crypto: null,
	synths: null,
	totalSynths: null,
	isFetching: false,
	isFetched: false,
	isRefreshing: false,
	fetchError: null,
};

const sliceName = 'balances';

export const balancesSlice = createSlice({
	name: sliceName,
	initialState,
	reducers: {
		fetchBalancesRequest: state => {
			state.fetchError = null;
			state.isFetching = true;
			if (state.isFetched) {
				state.isRefreshing = true;
			}
		},
		fetchBalancesFailure: (state, action: PayloadAction<{ error: string }>) => {
			state.fetchError = action.payload.error;
			state.isFetching = false;
			state.isRefreshing = false;
		},
		fetchBalancesSuccess: (
			state,
			action: PayloadAction<{ crypto: Balances; synths: SynthBalances; totalSynths: number }>
		) => {
			state.crypto = action.payload.crypto;
			state.synths = action.payload.synths;
			state.totalSynths = action.payload.totalSynths;
			state.isFetching = false;
			state.isRefreshing = false;
			state.isFetched = true;
		},
	},
});

export const {
	fetchBalancesRequest,
	fetchBalancesFailure,
	fetchBalancesSuccess,
} = balancesSlice.actions;

const getBalanceState = (state: RootState) => state[sliceName];
export const getWalletBalances = (state: RootState) => {
	const { crypto, synths, totalSynths } = getBalanceState(state);
	return { crypto, synths, totalSynths };
};

export const getWalletBalancesWithRates = createSelector(
	getRates,
	getWalletBalances,
	(rates, balances) => {
		const { crypto, synths, totalSynths } = balances;
		if (!rates || !crypto || !synths || totalSynths === null) return null;
		let cryptoBalanceWithRates: CryptoBalanceWithRates = {};

		Object.keys(crypto as Balances).forEach((currencyName: CurrencyKey) => {
			const balance = crypto[currencyName];
			cryptoBalanceWithRates[currencyName] = {
				balance,
				valueUSD: balance * rates[currencyName],
			};
		});

		const synthsBalanceWithRates: SynthsBalanceWithRates[] = orderBy(
			synths.map(({ balance, name }) => {
				return {
					name: name.toString(),
					balance,
					valueUSD: balance * rates[name],
				};
			}),
			'valueUSD',
			'desc'
		);

		const totalSynthsBalanceWithRates: BalanceWithRates = {
			balance: totalSynths,
			valueUSD: totalSynths * rates[CRYPTO_CURRENCY_TO_KEY.sUSD],
		};

		return {
			crypto: cryptoBalanceWithRates,
			synths: synthsBalanceWithRates,
			totalSynths: totalSynthsBalanceWithRates,
		};
	}
);

function* fetchBalances() {
	const currentWallet = yield select(getCurrentWallet);
	if (!currentWallet) return false;
	try {
		const balances = yield getBalances(currentWallet);
		yield put(fetchBalancesSuccess({ ...balances }));
	} catch (e) {
		yield put(fetchBalancesFailure({ error: e.message }));
		return false;
	}
}

export function* watchFetchBalances() {
	yield takeLatest(fetchBalancesRequest.type, fetchBalances);
}

export default balancesSlice.reducer;
