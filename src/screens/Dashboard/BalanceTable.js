import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash/isEmpty';

import { getWalletBalancesWithRates } from '../../ducks/balances';
import { getRates } from '../../ducks/rates';

import { CRYPTO_CURRENCY_TO_KEY } from '../../constants/currency';
import { TABLE_PALETTE } from '../../components/Table/constants';

import Table from '../../components/Table';
import Tooltip from '../../components/Tooltip';
import Box from './Box';
import Skeleton from '../../components/Skeleton';
import { formatCurrency } from '../../helpers/formatters';
import { FlexDivCentered } from '../../styles/common';
import { Info } from '../../components/Icons';

const TABLE_COLUMNS = ['SNX', 'sUSD', 'ETH', 'Synths', 'Debt'];
const AGGREGATED_COLUMNS = ['Synths', 'Debt'];

const renderTooltip = (tooltip, t) => {
	if (!tooltip) return;
	return (
		<Tooltip title={t(`tooltip.${tooltip}Balance`)} placement="top">
			<IconContainer>
				<Info />
			</IconContainer>
		</Tooltip>
	);
};

const getBalance = (column, walletBalancesWithRates, debtData, rates) => {
	if (!AGGREGATED_COLUMNS.includes(column)) {
		return walletBalancesWithRates[column];
	} else if (column === 'Synths') {
		return { ...walletBalancesWithRates.totalSynths, tooltip: 'synths' };
	} else {
		return {
			balance: debtData.debtBalance,
			valueUSD: debtData.debtBalance * rates[CRYPTO_CURRENCY_TO_KEY.sUSD],
			tooltip: 'debt',
		};
	}
};

const mapBalanceData = (waitingForData, walletBalancesWithRates, rates, debtData) => {
	if (waitingForData) return [];
	return TABLE_COLUMNS.map(column => {
		return {
			name: AGGREGATED_COLUMNS.includes(column)
				? `dashboard.table.${column.toLowerCase()}`
				: column,
			icon: AGGREGATED_COLUMNS.includes(column) ? 'snx' : column,
			...getBalance(column, walletBalancesWithRates, debtData, rates),
		};
	});
};

const BalanceTable = ({ walletBalancesWithRates, rates, debtData }) => {
	const { t } = useTranslation();
	const waitingForData = isEmpty(walletBalancesWithRates) || isEmpty(rates) || isEmpty(debtData);
	const data = mapBalanceData(waitingForData, walletBalancesWithRates, rates, debtData);

	return (
		<Box style={{ marginTop: '16px' }} full={true}>
			<BoxInner>
				{waitingForData ? (
					<Skeleton width={'100%'} height={'242px'} />
				) : (
					<Table
						data={data}
						palette={TABLE_PALETTE.STRIPED}
						columns={[
							{
								Header: '',
								accessor: 'name',
								Cell: ({ value, row: { original } }) => {
									return (
										<FlexDivCentered>
											<CurrencyIcon src={`/images/currencies/${original.icon}.svg`} />
											{t(value)}
											{renderTooltip(original.tooltip, t)}
										</FlexDivCentered>
									);
								},
								sortable: false,
							},
							{
								Header: t('mintrActions.track.action.table.balance'),
								accessor: 'balance',
								Cell: ({ value }) => {
									return formatCurrency(value);
								},
								sortable: false,
							},
							{
								Header: '$ USD',
								accessor: 'valueUSD',
								Cell: ({ value }) => {
									return `$${formatCurrency(value)}`;
								},
								sortable: false,
							},
						]}
					/>
				)}
			</BoxInner>
		</Box>
	);
};

const BoxInner = styled.div`
	padding: 12px;
	width: 100%;
`;

const CurrencyIcon = styled.img`
	width: 22px;
	height: 22px;
	margin-right: 5px;
`;

const IconContainer = styled.div`
	margin-left: 10px;
	width: 23px;
	height: 23px;
`;

const mapStateToProps = state => ({
	walletBalancesWithRates: getWalletBalancesWithRates(state),
	rates: getRates(state),
});

export default connect(mapStateToProps, null)(BalanceTable);
