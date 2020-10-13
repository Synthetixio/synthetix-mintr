import { createSlice } from '@reduxjs/toolkit';
import { persistState, getPersistedState } from '../config/store';
import { isLightTheme } from '../styles/themes';

const persistedState = getPersistedState('ui');

export const uiSlice = createSlice({
	name: 'ui',
	initialState: {
		theme: 'dark',
		currentPage: 'landing',
		currentTab: 'home',
		tabParams: null,
		gweiPopupIsVisible: false,
		redirectToTrade: false,
		...persistedState,
	},
	reducers: {
		toggleTheme: state => {
			const theme = isLightTheme(state.theme) ? 'dark' : 'light';
			persistState('ui', { theme });
			state.theme = theme;
		},
		setCurrentPage: (state, action) => {
			state.currentPage = action.payload;
		},
		setCurrentTab: (state, action) => {
			const { tab, params } = action.payload;
			state.currentTab = tab;
			state.tabParams = params;
		},
		setRedirectToTrade: (state, action) => {
			if (action.payload) {
				state.currentPage = 'MAIN';
				state.currentTab = 'home';
			}
			state.redirectToTrade = action.payload;
		},
	},
});

const getUiState = state => state.ui;

export const getCurrentTheme = state => state.ui.theme;
export const getCurrentPage = state => getUiState(state).currentPage;
export const getCurrentTab = state => getUiState(state).currentTab;
export const getTabParams = state => getUiState(state).tabParams;
export const getRedirectToTrade = state => getUiState(state).redirectToTrade;

const { toggleTheme, setCurrentPage, setCurrentTab, setRedirectToTrade } = uiSlice.actions;

export { toggleTheme, setCurrentPage, setCurrentTab, setRedirectToTrade };

export default uiSlice.reducer;
