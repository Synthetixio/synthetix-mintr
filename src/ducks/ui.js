const TOGGLE_THEME = 'UI/TOGGLE_THEME';
const UPDATE_CURRENT_PAGE = 'UI/UPDATE_CURRENT_PAGE';
const UPDATE_CURRENT_TAB = 'UI/UPDATE_CURRENT_TAB';
const TOGGLE_TRANSACTION_SETTINGS_POPUP = 'UI/TOGGLE_TRANSACTION_SETTINGS_POPUP';

const defaultState = {
	theme: 'dark',
	currentPage: 'landing',
	currentTab: 'home',
	transactionSettingsPopupIsVisible: false,
};

// Reducer
export default (state = defaultState, action) => {
	switch (action.type) {
		case TOGGLE_THEME: {
			const themeIsDark = action.payload;
			localStorage.setItem('dark', JSON.stringify(themeIsDark));
			return { ...state, themeIsDark };
		}
		case UPDATE_CURRENT_PAGE: {
			return { ...state, currentPage: action.payload };
		}
		case UPDATE_CURRENT_TAB: {
			const { tab, params } = action.payload;
			return { ...state, currentTab: tab, tabParams: params };
		}

		case TOGGLE_TRANSACTION_SETTINGS_POPUP: {
			return { ...state, transactionSettingsPopupIsVisible: action.payload };
		}
		default:
			return state;
	}
};

// Actions
export const toggleTheme = themeIsDark => {
	return {
		type: TOGGLE_THEME,
		payload: themeIsDark,
	};
};

export const updateCurrentPage = page => {
	return {
		type: UPDATE_CURRENT_PAGE,
		payload: page,
	};
};

export const updateCurrentTab = (tab, params = null) => {
	return {
		type: UPDATE_CURRENT_TAB,
		payload: { tab, params },
	};
};

export const toggleTransactionSettingsPopup = isVisible => {
	return {
		type: TOGGLE_TRANSACTION_SETTINGS_POPUP,
		payload: isVisible,
	};
};

export const getCurrentPage = state => state.currenPage;
export const getCurrentTheme = state => state.ui.theme;
export const getCurrentTab = state => state.currentTab;
export const getTransactionSettingsPopupIsVisible = state =>
	state.transactionSettingsPopupIsVisible;
