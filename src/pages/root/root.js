import { hot } from 'react-hot-loader/root';
import React from 'react';
import styled from 'styled-components';
import Dashboard from '../dashboard';
import MainContainer from '../main-container';

const Root = () => {
  return (
    <RootWrapper>
      <Dashboard />
      <MainContainer />
    </RootWrapper>
  );
};

const RootWrapper = styled('div')`
  background: ${props => props.theme.background};
  width: 100%;
  transition: all ease-out 0.5s;
  display: flex;
  h1 {
    color: ${props => props.theme.colorStyles.heading};
  }
  h2 {
    color: ${props => props.theme.colorStyles.heading};
  }
  h3 {
    color: ${props => props.theme.colorStyles.heading};
  }
  h4 {
    color: ${props => props.theme.colorStyles.heading};
  }
  h5 {
    color: ${props => props.theme.colorStyles.heading};
  }
  h6 {
    color: ${props => props.theme.colorStyles.body};
  }
  p {
    color: ${props => props.theme.colorStyles.body};
  }
`;

export default hot(Root);
