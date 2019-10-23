import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';

import RewardEscrow from './RewardEscrow';
import TokenSaleEscrow from './TokenSaleEscrow';

import PageContainer from '../../../components/PageContainer';

const DEFAULT_ESCROW_PAGE = 'rewardEscrow';

const Escrow = () => {
  const [showTokenSale, setPage] = useState(DEFAULT_ESCROW_PAGE);
  const EscrowPage =
    showTokenSale === 'rewardEscrow' ? RewardEscrow : TokenSaleEscrow;
  return (
    <PageContainer>
      <EscrowPage onPageChange={page => setPage(page)} />
    </PageContainer>
  );
};

export default withTranslation()(Escrow);
