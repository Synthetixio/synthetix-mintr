import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { takeLatest, put, select } from 'redux-saga/effects';
import snxJSConnector from '../helpers/snxJSConnector';

import { getCurrentWallet } from './wallet';
import { RootState } from './types';
import { getEscrowData } from 'dataFetcher';

export type EscrowSlice = {
	escrowedBalances: EscrowedBalances | null;
	isFetching: boolean;
	isFetched: boolean;
	isRefreshing: boolean;
	fetchError: string | null;
};

export type EscrowedBalances = {
	stakingRewards: number;
	tokenSale: number;
};

const initialState: EscrowSlice = {
	escrowedBalances: null,
	isFetching: false,
	isFetched: false,
	isRefreshing: false,
	fetchError: null,
};

const sliceName = 'escrow';

export const escrowSlice = createSlice({
	name: sliceName,
	initialState,
	reducers: {
		fetchEscrowRequest: state => {
			state.fetchError = null;
			state.isFetching = true;
			if (state.isFetched) {
				state.isRefreshing = true;
			}
		},
		fetchEscrowFailure: (state, action: PayloadAction<{ error: string }>) => {
			state.fetchError = action.payload.error;
			state.isFetching = false;
			state.isRefreshing = false;
		},
		fetchEscrowSuccess: (state, action: PayloadAction<{ escrowedBalances: EscrowedBalances }>) => {
			state.escrowedBalances = action.payload.escrowedBalances;
			state.isFetching = false;
			state.isRefreshing = false;
			state.isFetched = true;
		},
	},
});

export const { fetchEscrowRequest, fetchEscrowFailure, fetchEscrowSuccess } = escrowSlice.actions;

const getEscrowState = (state: RootState) => state[sliceName];
export const getEscrowedBalances = (state: RootState) => getEscrowState(state).escrowedBalances;
export const getTotalEscrowedBalance = createSelector(getEscrowedBalances, escrowedBalances => {
	if (!escrowedBalances) return;
	const { stakingRewards, tokenSale } = escrowedBalances;
	return stakingRewards + tokenSale;
});

function* fetchEscrowedBalances() {
	const currentWallet = yield select(getCurrentWallet);
	if (currentWallet != null) {
		try {
			const escrowedBalances = yield getEscrowData(currentWallet);
			yield put(fetchEscrowSuccess({ escrowedBalances }));
		} catch (e) {
			yield put(fetchEscrowFailure({ error: e.message }));
			return false;
		}
	}
	return false;
}

export function* watchFetchEscrowRequest() {
	yield takeLatest(fetchEscrowRequest.type, fetchEscrowedBalances);
}

export default escrowSlice.reducer;
