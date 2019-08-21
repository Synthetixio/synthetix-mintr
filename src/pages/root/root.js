import { hot } from 'react-hot-loader/root';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import Dashboard from '../dashboard';
import MainContainer from '../main-container';
// import Landing from '../landing';

const Root = () => {
  // const [currentPage, setCurrentPage] = useContext();
  return (
    <Suspense fallback="loading">
      <RootWrapper>
        <Dashboard />
        <MainContainer />
      </RootWrapper>
    </Suspense>
  );
};

const RootWrapper = styled('div')`
  background: ${props => props.theme.background};
  width: 100%;
  display: flex;
  // & > * {
  //   transition-property: background, border, color;
  //   transition-duration: 0.3s;
  //   transition-timing-function: ease-out;
  // }
`;

export default hot(Root);
