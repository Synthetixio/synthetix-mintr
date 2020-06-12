import { createSlice } from '@reduxjs/toolkit';
// import snxJSConnector from '../helpers/snxJSConnector';

export const appSlice = createSlice({
	name: 'app',
	initialState: {
		isReady: false,
		isFetching: false,
		isFetched: false,
		isRefreshing: false,
		fetchError: null,
	},
	reducers: {
		setAppReady: state => {
			state.isReady = true;
		},
		fetchAppStatusRequest: state => {
			state.fetchError = null;
			state.isFetching = true;
			if (state.isFetched) {
				state.isRefreshing = true;
			}
		},
		fetchAppStatusFailure: (state, action) => {
			state.fetchError = action.payload.error;
			state.isFetching = false;
			state.isRefreshing = false;
		},
		fetchAppStatusSuccess: (state, action) => {
			state.isOnMaintenance = action.payload;
			state.isFetching = false;
			state.isRefreshing = false;
			state.isFetched = true;
		},
	},
});

const {
	setAppReady,
	// fetchAppStatusRequest,
	// fetchAppStatusFailure,
	// fetchAppStatusSuccess,
} = appSlice.actions;

const getAppState = state => state.app;

export const getAppIsReady = state => getAppState(state).isReady;

export { setAppReady };

export default appSlice.reducer;
