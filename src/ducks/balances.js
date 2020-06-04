import { createSlice, createSelector } from '@reduxjs/toolkit';
import { takeLatest, put, select } from 'redux-saga/effects';
import isEmpty from 'lodash/isEmpty';
import orderBy from 'lodash/orderBy';
import snxJSConnector from '../helpers/snxJSConnector';
import { CRYPTO_CURRENCY_TO_KEY } from '../constants/currency';
import { bytesFormatter, bigNumberFormatter, parseBytes32String } from '../helpers/formatters';
import { getRates } from './rates';
import { getCurrentWallet } from './wallet';

export const balancesSlice = createSlice({
	name: 'balances',
	initialState: {
		balances: {},
		isFetching: false,
		isFetched: false,
		isRefreshing: false,
		fetchError: null,
	},
	reducers: {
		fetchBalancesRequest: state => {
			state.fetchError = null;
			state.isFetching = true;
			if (state.isFetched) {
				state.isRefreshing = true;
			}
		},
		fetchBalancesFailure: (state, action) => {
			state.fetchError = action.payload.error;
			state.isFetching = false;
			state.isRefreshing = false;
		},
		fetchBalancesSuccess: (state, action) => {
			state.balances = action.payload;
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

const getBalanceState = state => state.balances;
export const getWalletBalances = state => getBalanceState(state).balances;

export const getWalletBalancesWithRates = createSelector(
	getRates,
	getWalletBalances,
	(rates, balances) => {
		if (isEmpty(rates) || isEmpty(balances)) return {};
		let balancesWithRates = {};
		let synthBalancesWithRates = [];
		Object.keys(balances).forEach(type => {
			if (typeof balances[type] === 'number') {
				const balance = balances[type];
				const rate =
					type === 'totalSynths'
						? rates[CRYPTO_CURRENCY_TO_KEY.sUSD]
						: type === 'ETH'
						? rates['sETH']
						: rates[type];
				balancesWithRates[type] = {
					balance,
					valueUSD: balance * rate,
				};
			} else if (typeof balances[type] === 'object' && balances[type].length > 0) {
				synthBalancesWithRates = balances[type].map(({ balance, name }) => {
					return {
						name,
						balance,
						valueUSD: balance * rates[name],
					};
				});
			}
		});
		return { ...balancesWithRates, synths: orderBy(synthBalancesWithRates, 'valueUSD', 'desc') };
	}
);

function* fetchBalances() {
	const currentWallet = yield select(getCurrentWallet);
	if (!currentWallet != null) {
		try {
			const {
				synthSummaryUtilContract,
				snxJS: { Synthetix },
				provider,
			} = snxJSConnector;
			const [
				synthBalanceResults,
				totalSynthsBalanceResults,
				snxBalanceResults,
				ethBalanceResults,
			] = yield Promise.all([
				synthSummaryUtilContract.synthsBalances(currentWallet),
				synthSummaryUtilContract.totalSynthsInKey(
					currentWallet,
					bytesFormatter(CRYPTO_CURRENCY_TO_KEY.sUSD)
				),
				Synthetix.collateral(currentWallet),
				provider.getBalance(currentWallet),
			]);

			const [synthsKeys, synthsBalances] = synthBalanceResults;

			const synths = synthsKeys
				.map((key, i) => {
					const synthName = parseBytes32String(key);
					return {
						name: synthName,
						balance: bigNumberFormatter(synthsBalances[i]),
					};
				})
				.filter(synth => synth.balance);

			const sUSDBalance = synths.find(synth => synth.name === CRYPTO_CURRENCY_TO_KEY.sUSD);
			yield put(
				fetchBalancesSuccess({
					[CRYPTO_CURRENCY_TO_KEY.SNX]: bigNumberFormatter(snxBalanceResults),
					[CRYPTO_CURRENCY_TO_KEY.ETH]: bigNumberFormatter(ethBalanceResults),
					[CRYPTO_CURRENCY_TO_KEY.sUSD]: sUSDBalance ? sUSDBalance.balance : 0,
					synths,
					totalSynths: bigNumberFormatter(totalSynthsBalanceResults),
				})
			);
		} catch (e) {
			yield put(fetchBalancesFailure({ error: e.message }));
			return false;
		}
	}
	return false;
}

export function* watchFetchBalances() {
	yield takeLatest(fetchBalancesRequest.type, fetchBalances);
}

export default balancesSlice.reducer;
