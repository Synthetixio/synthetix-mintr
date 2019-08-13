import React from 'react';
import styled from 'styled-components';
import Home from '../home';

const MainContainer = () => {
  return (
    <MainContainerWrapper>
      <Header>
        <button>Home</button>
        <button>Depot</button>
        <button>Transaction history</button>
        <button>Escrow</button>
      </Header>
      <Home />
    </MainContainerWrapper>
  );
};

const MainContainerWrapper = styled('div')`
  width: 100%;
  border-left: 2px solid black;
`;

const Header = styled('div')`
  display: flex;
  justify-content: space-between;
  height: 50px;
`;

export default MainContainer;
