import { createSlice } from '@reduxjs/toolkit';
import snxData from 'synthetix-data';

import { TRANSACTION_EVENTS_MAP } from '../constants/transactionHistory';

export const depotHistorySlice = createSlice({
	name: 'depotHistory',
	initialState: {
		transactions: [],
		isFetching: false,
		isFetched: false,
		isRefreshing: false,
		fetchError: null,
	},
	reducers: {
		fetchDepotHistoryRequest: state => {
			state.fetchError = null;
			state.isFetching = true;
			if (state.isFetched) {
				state.isRefreshing = true;
			}
		},
		fetchDepotHistoryFailure: (state, action) => {
			state.fetchError = action.payload.error;
			state.isFetching = false;
			state.isRefreshing = false;
		},
		fetchDepotHistorySuccess: (state, action) => {
			state.transactions = action.payload;
			state.isFetching = false;
			state.isRefreshing = false;
			state.isFetched = true;
		},
	},
});

const {
	fetchDepotHistoryRequest,
	fetchDepotHistoryFailure,
	fetchDepotHistorySuccess,
} = depotHistorySlice.actions;

const getDepotHistoryState = state => state.depotHistory;
export const getIsFetchingDepotHistory = state => getDepotHistoryState(state).isFetching;
export const getIsRefreshingDepotHistory = state => getDepotHistoryState(state).isRefreshing;
export const getIsFetchedDepotHistory = state => getDepotHistoryState(state).isFetched;
export const getDepotHistoryFetchError = state => getDepotHistoryState(state).fetchError;
export const getDepotHistory = state => getDepotHistoryState(state).transactions;

export const fetchDepotHistory = walletAddress => async dispatch => {
	dispatch(fetchDepotHistoryRequest());

	try {
		const [depotActions, cleared] = await Promise.all([
			snxData.depot.userActions({ user: walletAddress, max: 1000 }),
			snxData.depot.clearedDeposits({ toAddress: walletAddress, max: 1000 }),
		]);

		const deposited = [];
		const removed = [];

		depotActions.forEach(event => {
			if (event.type === TRANSACTION_EVENTS_MAP.deposit) deposited.push(event);
			if (event.type === TRANSACTION_EVENTS_MAP.removal) removed.push(event);
		});
		dispatch(fetchDepotHistorySuccess({ cleared, deposited, removed }));
	} catch (e) {
		dispatch(fetchDepotHistoryFailure({ error: e.message }));
	}
};

export default depotHistorySlice.reducer;
