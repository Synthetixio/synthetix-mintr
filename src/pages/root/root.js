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
  height: 100vh;
  h1 {
    color: ${props => props.theme.body};
    margin: 0;
  }
  transition: all ease-out 0.5s;
  display: flex;
  padding: 32px 0;
`;

export default Root;
