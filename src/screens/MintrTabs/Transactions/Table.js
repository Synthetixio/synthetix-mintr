import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import styled from 'styled-components';

import { Table, THead, TBody, TH, TR, TD } from '../../../components/ScheduleTable';
import { DataLarge, TableHeaderMedium } from '../../../components/Typography';
import { BorderlessButton } from '../../../components/Button';
import { getEtherscanTxLink } from '../../../helpers/explorers';
import { formatCurrency } from '../../../helpers/formatters';

import { TRANSACTION_EVENTS_MAP } from '../../../constants/transactionHistory';

const getAmountForEventType = event => {
	switch (event.type) {
		case TRANSACTION_EVENTS_MAP.deposit:
			return `${formatCurrency(event.amount)} sUSD`;
		case TRANSACTION_EVENTS_MAP.cleared:
			return `${formatCurrency(event.toAmount)} sUSD`;
		case TRANSACTION_EVENTS_MAP.withdrawl:
			return `${formatCurrency(event.amount)} sUSD`;
		case TRANSACTION_EVENTS_MAP.exchanged:
			return `${formatCurrency(event.fromAmount)} ${event.fromCurrencyKey} / ${formatCurrency(
				event.toAmount
			)} ${event.toCurrencyKey}`;
		case TRANSACTION_EVENTS_MAP.issued:
			return `${formatCurrency(event.value)} sUSD`;
		case TRANSACTION_EVENTS_MAP.burned:
			return `${formatCurrency(event.value)} sUSD`;
	}
};

const TableContainer = ({ data }) => {
	const { t } = useTranslation();

	return (
		<Table cellSpacing="0">
			<THead>
				<TR>
					{[
						'transactions.filters.type',
						'transactions.filters.amount',
						'transactions.filters.date',
						'',
					].map((headerElement, i) => {
						return (
							<StyledTH style={{ textAlign: i === 2 ? 'right' : 'left' }} key={headerElement}>
								<TableHeaderMedium>{t(headerElement)}</TableHeaderMedium>
							</StyledTH>
						);
					})}
				</TR>
			</THead>

			<TBody>
				{data.map((event, i) => {
					return (
						<TR key={i}>
							<TD>
								<TDInner>
									<TypeImage img src={`/images/transactions/${event.type}.svg`} />
									<EventName>{t(`transactions.events.${event.type}`)}</EventName>
								</TDInner>
							</TD>
							<TD>
								<DataLarge>{getAmountForEventType(event)}</DataLarge>
							</TD>
							<TD style={{ textAlign: 'right' }}>
								<DataLarge>{format(new Date(event.timestamp), 'd MMM yy | hh:mm')}</DataLarge>
							</TD>
							<TD style={{ textAlign: 'right' }}>
								<BorderlessButton href={getEtherscanTxLink('1', event.hash)} as="a" target="_blank">
									{t('button.navigation.view')}
								</BorderlessButton>
							</TD>
						</TR>
					);
				})}
			</TBody>
		</Table>
	);
};

const TypeImage = styled.img`
	width: 16px;
	height: 16px;
	margin-right: 8px;
`;

const TDInner = styled.div`
	display: flex;
	align-items: center;
`;

const EventName = styled(DataLarge)`
	text-transform: capitalize;
`;

const StyledTH = styled(TH)`
	padding: 10px 20px;
`;

export default TableContainer;
