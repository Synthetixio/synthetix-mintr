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
  h1 {
    color: ${props => props.theme.body};
  }
  transition: all ease-out 0.5s;
  display: flex;
`;

export default Root;
