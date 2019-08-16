import React, { useState } from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';
import { Home, Depot, Transactions, Escrow } from './screens';
import ContentHeaderButton from '../../components/content-header-button';

const defaultScreen = 'home';

const renderButtons = (t, currentScreen, setScreen) => {
  return ['home', 'depot', 'transactionsHistory', 'escrow'].map(page => {
    return (
      <ContentHeaderButton
        isSelected={page === currentScreen}
        onClick={() => setScreen(page)}
      >
        {/* i18next-extract-disable-next-line */}
        {t(`mainContent.header.buttons.${page}`)}
      </ContentHeaderButton>
    );
  });
};

const renderScreen = screen => {
  switch (screen) {
    case 'home':
    default:
      return <Home />;
    case 'depot':
      return <Depot />;
    case 'transactionsHistory':
      return <Transactions />;
    case 'escrow':
      return <Escrow />;
  }
};

const MainContainer = ({ t }) => {
  const [currentScreen, setScreen] = useState(defaultScreen);

  return (
    <MainContainerWrapper>
      <Header>{renderButtons(t, currentScreen, setScreen)}</Header>
      {renderScreen(currentScreen)}
    </MainContainerWrapper>
  );
};

const MainContainerWrapper = styled('div')`
  width: 100%;
  background-color: ${props => props.theme.colorStyles.background};
`;

const Header = styled('div')`
  display: flex;
  justify-content: space-between;
  height: 80px;
  background-color: ${props => props.theme.colorStyles.menu};
`;

export default withTranslation()(MainContainer);
