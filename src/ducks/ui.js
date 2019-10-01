const TOGGLE_THEME = 'UI/TOGGLE_THEME';
const UPDATE_CURRENT_PAGE = 'UI/UPDATE_CURRENT_PAGE';
const UPDATE_CURRENT_TAB = 'UI/UPDATE_CURRENT_TAB';
const TOGGLE_DASHBOARD_IS_LOADING = 'UI/TOGGLE_DASHBOARD_IS_LOADING';
const TOGGLE_TRANSACTION_SETTINGS_POPUP =
  'UI/TOGGLE_TRANSACTION_SETTINGS_POPUP';
const TOGGLE_LANGUAGE_DROPDOWN = 'UI/TOGGLE_LANGUAGE_DROPDOWN';

// Reducer
export default (state, action) => {
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
      return { ...state, currentTab: action.payload };
    }
    case TOGGLE_DASHBOARD_IS_LOADING: {
      return { ...state, dashboardIsLoading: action.payload };
    }
    case TOGGLE_TRANSACTION_SETTINGS_POPUP: {
      return { ...state, transactionSettingsPopupIsVisible: action.payload };
    }
    case TOGGLE_LANGUAGE_DROPDOWN: {
      return { ...state, languageDropdownIsVisible: action.payload };
    }
    default:
      return state;
  }
};

// Actions
export const toggleTheme = (themeIsDark, dispatch) => {
  return dispatch({
    type: TOGGLE_THEME,
    payload: themeIsDark,
  });
};

export const updateCurrentPage = (page, dispatch) => {
  return dispatch({
    type: UPDATE_CURRENT_PAGE,
    payload: page,
  });
};

export const updateCurrentTab = (tab, dispatch) => {
  return dispatch({
    type: UPDATE_CURRENT_TAB,
    payload: tab,
  });
};

export const toggleDashboardIsLoading = (isLoading, dispatch) => {
  return dispatch({
    type: TOGGLE_DASHBOARD_IS_LOADING,
    payload: isLoading,
  });
};

export const toggleTransactionSettingsPopup = (isVisible, dispatch) => {
  return dispatch({
    type: TOGGLE_TRANSACTION_SETTINGS_POPUP,
    payload: isVisible,
  });
};

export const toggleLanguageDropdown = (isVisible, dispatch) => {
  return dispatch({
    type: TOGGLE_LANGUAGE_DROPDOWN,
    payload: isVisible,
  });
};
