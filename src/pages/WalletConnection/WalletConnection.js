import React, { useContext } from 'react';
import styled from 'styled-components';

import { Store } from '../../store';
import { updateCurrentPage } from '../../ducks/ui';

const WalletConnection = () => {
  const { dispatch } = useContext(Store);
  return (
    <WalletConnectionWrapper>
      <h1>This is the wallet connection page</h1>
      <button onClick={() => updateCurrentPage('walletSelection', dispatch)}>
        connect
      </button>
    </WalletConnectionWrapper>
  );
};

const WalletConnectionWrapper = styled.div``;

export default WalletConnection;
