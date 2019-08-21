import React, { useContext } from 'react';
import styled from 'styled-components';

import { Store } from '../../store';
import { updateCurrentPage } from '../../ducks/ui';

const Landing = () => {
  const { dispatch } = useContext(Store);
  return (
    <LandingWrapper>
      <h1>this is the landing page</h1>
      <button onClick={() => updateCurrentPage('walletConnection', dispatch)}>
        connect to wallet
      </button>
    </LandingWrapper>
  );
};

const LandingWrapper = styled.div``;

export default Landing;
