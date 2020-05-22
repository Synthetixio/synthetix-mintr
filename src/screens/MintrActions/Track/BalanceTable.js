import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getWalletBalancesWithRates } from '../../../ducks/balances';

import Table from '../../../components/Table';
import { TABLE_PALETTE } from '../../../components/Table/constants';

import { formatCurrencyWithSign, formatCurrency } from '../../../helpers/formatters';

import { FlexDivCentered } from '../../../styles/common';

const BalanceTable = ({ walletBalancesWithRates }) => {
	const { t } = useTranslation();
	return (
		<Table
			data={(walletBalancesWithRates && walletBalancesWithRates.synths) || []}
			palette={TABLE_PALETTE.STRIPED}
			columns={[
				{
					Header: t('mintrActions.track.action.table.yourSynths'),
					accessor: 'name',
					Cell: ({ value }) => {
						return (
							<FlexDivCentered>
								<CurrencyIcon src={`/images/currencies/${value}.svg`} />
								{t(value)}
							</FlexDivCentered>
						);
					},
					sortable: false,
				},
				{
					Header: t('mintrActions.track.action.table.balance'),
					accessor: 'balance',
					Cell: ({ value }) => {
						return `${formatCurrency(value)}`;
					},
					sortable: true,
				},
				{
					Header: '$ USD',
					accessor: 'valueUSD',
					Cell: ({ value }) => {
						return `${formatCurrencyWithSign('$', value)}`;
					},
					sortable: true,
				},
			]}
		/>
	);
};

const CurrencyIcon = styled.img`
	width: 22px;
	height: 22px;
	margin-right: 5px;
`;

const mapStateToProps = state => ({
	walletBalancesWithRates: getWalletBalancesWithRates(state),
});

export default connect(mapStateToProps, null)(BalanceTable);
