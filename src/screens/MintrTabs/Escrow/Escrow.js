import React, { useState } from 'react';
import styled from 'styled-components';
// import snxJSConnector from '../../../helpers/snxJSConnector';

import RewardEscrow from './RewardEscrow';
import TokenSaleEscrow from './TokenSaleEscrow';
import { ButtonPrimary, ButtonSecondary } from '../../../components/Button';
import PageContainer from '../../../components/PageContainer';

const SHOW_TOKEN_SALE = false;

const Escrow = () => {
  const [showTokenSale, setPage] = useState(SHOW_TOKEN_SALE);
  const EscrowPage = showTokenSale ? TokenSaleEscrow : RewardEscrow;
  return (
    <PageContainer>
      <EscrowPage />
      <ButtonRow>
        <ButtonSecondary onClick={() => setPage(!showTokenSale)}>
          VIEW {showTokenSale ? 'STAKING' : 'TOKEN SALE'} ESCROW
        </ButtonSecondary>
        <ButtonPrimary>VEST NOW</ButtonPrimary>
      </ButtonRow>
    </PageContainer>
  );
};

const ButtonRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

export default Escrow;
