const TOGGLE_THEME = 'UI/TOGGLE_THEME';

// Reducer
export default (state, action) => {
  switch (action.type) {
    case 'UI/TOGGLE_THEME': {
      const themeIsDark = action.payload;
      localStorage.setItem('dark', JSON.stringify(themeIsDark));
      return { ...state, themeIsDark };
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
