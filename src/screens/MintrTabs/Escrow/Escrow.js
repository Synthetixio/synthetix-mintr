import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';

import RewardEscrow from './RewardEscrow';
import TokenSaleEscrow from './TokenSaleEscrow';

import PageContainer from '../../../components/PageContainer';
import { PageTitle, PLarge } from 'components/Typography';
import { ExternalLink } from 'styles/common';

const DEFAULT_ESCROW_PAGE = 'rewardEscrow';

const Escrow = () => {
	// const [showTokenSale, setPage] = useState(DEFAULT_ESCROW_PAGE);
	// const EscrowPage = showTokenSale === 'rewardEscrow' ? RewardEscrow : TokenSaleEscrow;
	return (
		<PageContainer>
			<PageTitle>Escrow is not supported</PageTitle>
			<PLarge>
				Mintr does not support escrow functionality anymore. Please migrate to the new staking app{' '}
				<ExternalLink href="https://staking.synthetix.io">here</ExternalLink>
			</PLarge>

			{/* <EscrowPage onPageChange={page => setPage(page)} /> */}
		</PageContainer>
	);
};

export default withTranslation()(Escrow);
