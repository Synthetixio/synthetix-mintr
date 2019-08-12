import React from 'react';
import styled from 'styled-components';
import Header from '../../components/header';
import { withTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/themeContext';

const Root = ({ t }) => {
  const themeState = useTheme();
  return (
    <Wrapper>
      <h1>Dark Mode example</h1>
      <div>
        <button onClick={() => themeState.toggle()}>
          {themeState.dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled('div')`
  background: ${props => props.theme.background};
  width: 100vw;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen';
  h1 {
    color: ${props => props.theme.body};
  }
  transition: all ease-out 0.5s;
`;

export default withTranslation()(Root);
