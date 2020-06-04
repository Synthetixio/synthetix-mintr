import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { takeLatest, put, select } from 'redux-saga/effects';
import snxJSConnector from '../helpers/snxJSConnector';

import { getCurrentWallet } from './wallet';
import { RootState } from './types';
import { getDebtStatus } from 'dataFetcher';

export type DebtStatusSlice = {
	debtStatusData: DebtStatus | null;
	isFetching: boolean;
	isFetched: boolean;
	isRefreshing: boolean;
	fetchError: string | null;
};

export type DebtStatus = {
	targetCRatio: number;
	currentCRatio: number;
	transferableSNX: number;
	debtBalanceOf: number;
};

const initialState: DebtStatusSlice = {
	debtStatusData: null,
	isFetching: false,
	isFetched: false,
	isRefreshing: false,
	fetchError: null,
};

const sliceName = 'debtStatus';

export const debtStatusSlice = createSlice({
	name: sliceName,
	initialState,
	reducers: {
		fetchDebtStatusRequest: state => {
			state.fetchError = null;
			state.isFetching = true;
			if (state.isFetched) {
				state.isRefreshing = true;
			}
		},
		fetchDebtStatusFailure: (state, action: PayloadAction<{ error: string }>) => {
			state.fetchError = action.payload.error;
			state.isFetching = false;
			state.isRefreshing = false;
		},
		fetchDebtStatusSuccess: (state, action: PayloadAction<{ debtStatus: DebtStatus }>) => {
			state.debtStatusData = action.payload.debtStatus;
			state.isFetching = false;
			state.isRefreshing = false;
			state.isFetched = true;
		},
	},
});

export const {
	fetchDebtStatusRequest,
	fetchDebtStatusFailure,
	fetchDebtStatusSuccess,
} = debtStatusSlice.actions;

const getDebtState = (state: RootState) => state[sliceName];
export const getDebtStatusData = (state: RootState) => getDebtState(state).debtStatusData;

function* fetchDebtStatus() {
	const currentWallet = yield select(getCurrentWallet);
	if (currentWallet != null) {
		try {
			const debtStatus = yield getDebtStatus(currentWallet);
			yield put(fetchDebtStatusSuccess({ debtStatus }));
		} catch (e) {
			yield put(fetchDebtStatusFailure({ error: e.message }));
			return false;
		}
	}
	return false;
}

export function* watchFetchDebtStatusRequest() {
	yield takeLatest(fetchDebtStatusRequest.type, fetchDebtStatus);
}

export default debtStatusSlice.reducer;
