import React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';
import Home from '../home';

const MainContainer = ({ t }) => {
  return (
    <MainContainerWrapper>
      <Header>
        <button>{t('mainContent.header.buttons.home')}</button>
        <button>{t('mainContent.header.buttons.depot')}</button>
        <button>{t('mainContent.header.buttons.transactionsHistory')} </button>
        <button>{t('mainContent.header.buttons.escrow')}</button>
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

export default withTranslation()(MainContainer);
