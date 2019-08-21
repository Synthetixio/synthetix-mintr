const TOGGLE_THEME = 'UI/TOGGLE_THEME';
const UPDATE_CURRENT_PAGE = 'UI/UPDATE_CURRENT_PAGE';

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
