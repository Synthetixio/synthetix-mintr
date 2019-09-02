import { hot } from 'react-hot-loader/root';
import React, { Suspense, useContext } from 'react';
import styled from 'styled-components';

import { Store } from '../../store';

import Landing from '../Landing';
import WalletConnection from '../WalletConnection';
import WalletSelection from '../WalletSelection';
import Main from '../Main';
import Multisig from '../Multisig';

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
    case 'multisig':
      return <Multisig></Multisig>;
  }
};

const Root = () => {
  const {
    state: {
      ui: { currentPage },
    },
  } = useContext(Store);
  return (
    <Suspense fallback="loading">
      <RootWrapper>{renderCurrentPage(currentPage)}</RootWrapper>
    </Suspense>
  );
};

const RootWrapper = styled('div')`
  background: ${props => props.theme.colorStyles.background};
  width: 100%;
  height: 100vh;
  // & > * {
  //   transition-property: background, border, color;
  //   transition-duration: 0.3s;
  //   transition-timing-function: ease-out;
  // }
`;

export default hot(Root);
