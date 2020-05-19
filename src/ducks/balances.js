import { createSlice } from '@reduxjs/toolkit';
import snxJSConnector from '../helpers/snxJSConnector';
import { bytesFormatter, bigNumberFormatter, parseBytes32String } from '../helpers/formatters';

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

export const fetchBalances = walletAddress => async dispatch => {
	try {
		if (!walletAddress) throw new Error('wallet address is needed');
		dispatch(fetchBalancesRequest());
		const [
			synthBalanceResults,
			totalSynthsBalanceResults,
			snxBalanceResults,
			ethBalanceResults,
		] = await Promise.all([
			snxJSConnector.synthSummaryUtilContract.synthsBalances(walletAddress),
			snxJSConnector.synthSummaryUtilContract.totalSynthsInKey(
				walletAddress,
				bytesFormatter('sUSD')
			),
			snxJSConnector.snxJS.Synthetix.collateral(walletAddress),
			snxJSConnector.provider.getBalance(walletAddress),
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
				snx: bigNumberFormatter(snxBalanceResults),
				eth: bigNumberFormatter(ethBalanceResults),
				susd: synths.find(synth => synth.name === 'sUSD') || 0,
				synths,
				totalSynths: bigNumberFormatter(totalSynthsBalanceResults),
			})
		);
	} catch (e) {
		dispatch(fetchBalancesFailure({ error: e.message }));
	}
};

export default balancesSlice.reducer;
