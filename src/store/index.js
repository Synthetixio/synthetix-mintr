import React, { createContext, useReducer } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import theme from '../styles/themes';

export const Store = createContext();

export function StoreProvider(props) {
  const { reducers, initialState } = props;
  const [state, dispatch] = useReducer(reducers, initialState);
  const themeState = state.ui;
  const value = { state, dispatch };
  const currentTheme = themeState.themeIsDark ? theme('dark') : theme('light');
  return (
    <StyledThemeProvider theme={currentTheme}>
      <Store.Provider value={value}>{props.children}</Store.Provider>
    </StyledThemeProvider>
  );
}
