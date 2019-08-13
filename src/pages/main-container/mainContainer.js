import React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';
import Home from '../home';
import ContentHeaderButton from '../../components/content-header-button';

const renderButtons = (t) => {
  return ['home', 'depot', 'transactionsHistory', 'escrow'].map(page => {
    return <ContentHeaderButton isSelected={page === 'home'}>{t(`mainContent.header.buttons.${page}`)}</ContentHeaderButton>
  });
}

const MainContainer = ({ t }) => {
  return (
    <MainContainerWrapper>
      <Header>
        {renderButtons(t)} 
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
  height: 88px;
  background-color: ${props => props.theme.accentLight};
`;

export default withTranslation()(MainContainer);
