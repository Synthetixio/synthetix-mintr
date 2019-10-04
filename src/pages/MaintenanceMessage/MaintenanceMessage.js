import React from 'react';
import styled from 'styled-components';
import { H1, H2 } from '../../components/Typography';

const MaintenanceMessage = () => {
  return (
    <Container>
      <H1>Synthetix.Exchange is currently unavailable due to upgrades.</H1>
      <H2>Sorry for the inconvenience, it shall be back shortly.</H2>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

export default MaintenanceMessage;
