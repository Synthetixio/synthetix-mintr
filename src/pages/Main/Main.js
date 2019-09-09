import React, { useContext } from 'react';
import styled from 'styled-components';

import { Store } from '../../store';

import Dashboard from '../../screens/Dashboard';
import MintrPanel from '../../screens/MintrPanel';
import SETHPoolRewardDistribution from '../../screens/SETHPoolRewardDistribution';

const Main = () => {
  const {
    state: {
      ui: { currentPage },
    },
  } = useContext(Store);
  return (
    <MainWrapper>
      <Dashboard />
      {currentPage === 'sethpool'
        ? <SETHPoolRewardDistribution />
        : <MintrPanel />
      }
    </MainWrapper>
  );
};

const MainWrapper = styled.div`
  display: flex;
  width: 100%;
`;

export default Main;
