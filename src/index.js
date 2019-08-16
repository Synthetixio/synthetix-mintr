import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from './contexts/themeContext';
import './index.css';
import Root from './pages/root';
import './i18n';

ReactDOM.render(
  <ThemeProvider>
    <Root />
  </ThemeProvider>,
  document.getElementById('root')
);
