import React from 'react';
import { format } from 'date-fns';
import { formatCurrency } from '../../../helpers/formatters';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import Spinner from '../../../components/Spinner';
import { TableHeader, TableWrapper, Table, TBody, TR, TD } from '../../../components/ScheduleTable';
import {
	PLarge,
	H5,
	DataLarge,
	TableHeaderMedium,
	DataHeaderLarge,
	DataMega,
} from '../../../components/Typography';

const VestingTable = ({ loading, totalEscrowed, totalVested, canVest, schedule }) => {
	const { t } = useTranslation();

	if (loading) {
		return (
			<TablePlaceholder>
				<Spinner />
			</TablePlaceholder>
		);
	}

	if (!totalEscrowed || totalEscrowed.length === 0) {
		return (
			<TablePlaceholder>
				<PLarge>{t('escrow.staking.table.none')}</PLarge>
			</TablePlaceholder>
		);
	}
	return (
		<ScheduleWrapper>
			<H5>{t('escrow.staking.table.title')}</H5>
			<TableHeader>
				<TableHeaderMedium>{t('escrow.staking.table.date')}</TableHeaderMedium>
				<TableHeaderMedium>SNX {t('escrow.staking.table.quantity')}</TableHeaderMedium>
			</TableHeader>
			<StyledTableWrapper>
				<Table cellSpacing="0">
					<TBody>
						{schedule
							? schedule.map((row, i) => {
									return (
										<TR key={i}>
											<TD>
												<DataLarge>{format(row.date, 'dd MMMM yyyy')}</DataLarge>
											</TD>
											<TD>
												<DataLarge>{formatCurrency(row.quantity)}</DataLarge>
											</TD>
										</TR>
									);
							  })
							: null}
					</TBody>
				</Table>
			</StyledTableWrapper>
			<RightBlock>
				<DataBlockRow>
					<DataBlock>
						<DataHeaderLarge style={{ textTransform: 'uppercase' }}>
							{t('escrow.staking.available')}
						</DataHeaderLarge>
						<DataMegaEscrow>{canVest && formatCurrency(canVest)} SNX</DataMegaEscrow>
					</DataBlock>
					<DataBlock>
						<DataHeaderLarge style={{ textTransform: 'uppercase' }}>
							{t('escrow.staking.vested')}
						</DataHeaderLarge>
						<DataMegaEscrow>{totalVested && formatCurrency(totalVested)} SNX</DataMegaEscrow>
					</DataBlock>
					<DataBlock>
						<DataHeaderLarge style={{ textTransform: 'uppercase' }}>
							{t('escrow.staking.total')}
						</DataHeaderLarge>
						<DataMegaEscrow>{totalEscrowed && formatCurrency(totalEscrowed)} SNX</DataMegaEscrow>
					</DataBlock>
				</DataBlockRow>
			</RightBlock>
		</ScheduleWrapper>
	);
};

const ScheduleWrapper = styled.div`
	width: 100%;
	margin-top: 50px;
`;

const StyledTableWrapper = styled(TableWrapper)`
	height: 240px;
`;

const RightBlock = styled.div`
	margin-top: 40px;
	display: flex;
	justify-content: flex-end;
	width: 100%;
`;

const TablePlaceholder = styled.div`
	height: 450px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const DataBlockRow = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
`;

const DataBlock = styled.div`
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 2px;
	flex: 1;
	padding: 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-direction: column;
	&:not(:first-child) {
		border-left: none;
	}
`;

const DataMegaEscrow = styled(DataMega)`
	margin-top: 18px;
	color: ${props => props.theme.colorStyles.escrowNumberBig};
`;

export default VestingTable;
