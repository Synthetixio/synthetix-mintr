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
    color: ${props => props.theme.heading};
  }
  h2 {
    color: ${props => props.theme.heading};
  }  
  h3 {
    color: ${props => props.theme.heading};
  }  
  h4 {
    color: ${props => props.theme.heading};
  }
  h5 {
    color: ${props => props.theme.heading};
  }
  h6 {
    color: ${props => props.theme.body};
  }
  p {
    color: ${props => props.theme.body};
  }
`;

export default Root;
