import React from 'react';
import styled from 'styled-components';

import Dashboard from '../../screens/Dashboard';
import MintrPanel from '../../screens/MintrPanel';

const Main = () => {
  return (
    <MainWrapper>
      <Dashboard />
      <MintrPanel />
    </MainWrapper>
  );
};

const MainWrapper = styled.div`
  display: flex;
  width: 100%;
`;

export default Main;
