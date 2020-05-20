import { createSlice, createSelector } from '@reduxjs/toolkit';
import isEmpty from 'lodash/isEmpty';
import snxJSConnector from '../helpers/snxJSConnector';
import { CRYPTO_CURRENCY_TO_KEY } from '../constants/currency';
import { bytesFormatter, bigNumberFormatter, parseBytes32String } from '../helpers/formatters';
import { getRates } from './rates';

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

const { fetchBalancesRequest, fetchBalancesFailure, fetchBalancesSuccess } = balancesSlice.actions;

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
		return { ...balancesWithRates, synths: synthBalancesWithRates };
	}
);

export const fetchBalances = walletAddress => async dispatch => {
	try {
		if (!walletAddress) throw new Error('wallet address is needed');
		const {
			synthSummaryUtilContract,
			snxJS: { Synthetix },
			provider,
		} = snxJSConnector;
		dispatch(fetchBalancesRequest());
		const [
			synthBalanceResults,
			totalSynthsBalanceResults,
			snxBalanceResults,
			ethBalanceResults,
		] = await Promise.all([
			synthSummaryUtilContract.synthsBalances(walletAddress),
			synthSummaryUtilContract.totalSynthsInKey(
				walletAddress,
				bytesFormatter(CRYPTO_CURRENCY_TO_KEY.sUSD)
			),
			Synthetix.collateral(walletAddress),
			provider.getBalance(walletAddress),
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
		dispatch(
			fetchBalancesSuccess({
				[CRYPTO_CURRENCY_TO_KEY.SNX]: bigNumberFormatter(snxBalanceResults),
				[CRYPTO_CURRENCY_TO_KEY.ETH]: bigNumberFormatter(ethBalanceResults),
				[CRYPTO_CURRENCY_TO_KEY.sUSD]:
					synths.find(synth => synth.name === CRYPTO_CURRENCY_TO_KEY.sUSD) || 0,
				synths,
				totalSynths: bigNumberFormatter(totalSynthsBalanceResults),
			})
		);
	} catch (e) {
		dispatch(fetchBalancesFailure({ error: e.message }));
	}
};

export default balancesSlice.reducer;
