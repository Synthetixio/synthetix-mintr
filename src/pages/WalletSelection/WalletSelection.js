import React, { useContext } from 'react';
import styled from 'styled-components';

import { Store } from '../../store';
import { updateCurrentPage } from '../../ducks/ui';

const WalletSelection = () => {
  const { dispatch } = useContext(Store);
  return (
    <WalletSelectionWrapper>
      <h1>This is the wallet selection page</h1>
      <button onClick={() => updateCurrentPage('main', dispatch)}>
        go to Mintr
      </button>
    </WalletSelectionWrapper>
  );
};

const WalletSelectionWrapper = styled.div``;

export default WalletSelection;
