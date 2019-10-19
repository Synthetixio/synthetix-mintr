import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';

import RewardEscrow from './RewardEscrow';
import TokenSaleEscrow from './TokenSaleEscrow';

import PageContainer from '../../../components/PageContainer';

const SHOW_TOKEN_SALE = false;

const Escrow = () => {
  const [showTokenSale, setPage] = useState(SHOW_TOKEN_SALE);
  const EscrowPage = showTokenSale ? TokenSaleEscrow : RewardEscrow;

  return (
    <PageContainer>
      <EscrowPage onPageChange={page => setPage(page)} />
    </PageContainer>
  );
};

export default withTranslation()(Escrow);
