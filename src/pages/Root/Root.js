import { hot } from 'react-hot-loader/root';
import React, { Suspense, useContext } from 'react';
import styled from 'styled-components';

import { Store } from '../../store';

import Landing from '../Landing';
import WalletConnection from '../WalletConnection';
import WalletSelection from '../WalletSelection';
import Main from '../Main';
import MaintenanceMessage from '../MaintenanceMessage';

import NotificationCenter from '../../components/NotificationCenter';

const renderCurrentPage = currentPage => {
  switch (currentPage) {
    case 'landing':
    default:
      return <Landing />;
    case 'walletConnection':
      return <WalletConnection />;
    case 'walletSelection':
      return <WalletSelection />;
    case 'main':
      return <Main />;
    case 'maintenance':
      return <MaintenanceMessage />;
  }
};

const Root = () => {
  const {
    state: {
      ui: { currentPage },
    },
  } = useContext(Store);
  return (
    <Suspense fallback={<div></div>}>
      <RootWrapper>
        {renderCurrentPage(currentPage)}
        <NotificationCenter></NotificationCenter>
      </RootWrapper>
    </Suspense>
  );
};

const RootWrapper = styled('div')`
  position: relative;
  background: ${props => props.theme.colorStyles.background};
  width: 100%;
`;

export default hot(Root);
