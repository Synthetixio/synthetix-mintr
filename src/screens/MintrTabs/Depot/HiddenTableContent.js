import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { getWalletDetails } from '../../../ducks/wallet';
import { getEtherscanTxLink } from '../../../helpers/explorers';

import { TableDataMedium, DataLarge } from '../../../components/Typography';
import { BorderlessButton } from '../../../components/Button';
import { formatCurrency } from '../../../helpers/formatters';

const HiddenContentTable = ({ deposits, walletDetails: { networkId } }) => {
	const { t } = useTranslation();
	return (
		<HiddenContentWrapper>
			<HiddenTable style={{ width: '100%' }}>
				<HiddenTableHead>
					<HiddenTableRow>
						{[
							'depot.table.activity',
							'depot.table.amount',
							'depot.table.rate',
							'depot.table.timeDate',
							'',
						].map(headerElement => {
							return (
								<HiddenTableHeaderCell key={headerElement}>
									<DataLarge style={{ fontSize: '14px' }}>{t(headerElement)}</DataLarge>
								</HiddenTableHeaderCell>
							);
						})}
					</HiddenTableRow>
				</HiddenTableHead>
				<HiddenTableBody>
					{deposits.map((detail, i) => {
						return (
							<HiddenTableRow key={i}>
								<HiddenTableCell>
									<HiddenTableCellContainer>
										<TypeImage src="/images/actions/tiny-sold.svg" />
										<TableDataMedium>{t('depot.table.soldByDepot')}</TableDataMedium>
									</HiddenTableCellContainer>
								</HiddenTableCell>
								<HiddenTableCell>
									<TableDataMedium>{formatCurrency(detail.toAmount)} sUSD</TableDataMedium>
								</HiddenTableCell>
								<HiddenTableCell>
									<TableDataMedium>{formatCurrency(detail.rate)} sUSD / ETH</TableDataMedium>
								</HiddenTableCell>
								<HiddenTableCell>
									<TableDataMedium>{detail.date}</TableDataMedium>
								</HiddenTableCell>
								<HiddenTableCell>
									<BorderlessButton href={getEtherscanTxLink(detail.hash)} as="a" target="_blank">
										{t('button.navigation.view')}
									</BorderlessButton>
								</HiddenTableCell>
							</HiddenTableRow>
						);
					})}
				</HiddenTableBody>
			</HiddenTable>
		</HiddenContentWrapper>
	);
};

const TypeImage = styled.img`
	width: 16px;
	height: 16px;
	margin-right: 8px;
`;

const HiddenContentWrapper = styled.div`
	padding: 24px 16px;
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-top-width: 0;
`;

const HiddenTable = styled.table`
	width: 100%;
`;

const HiddenTableHead = styled.thead``;

const HiddenTableBody = styled.tbody``;

const HiddenTableHeaderCell = styled.th`
	padding-bottom: 5px;
	text-align: left;
	border-bottom: 1px solid ${props => props.theme.colorStyles.borders};
	:last-child {
		text-align: right;
	}
`;

const HiddenTableRow = styled.tr`
	:first-child {
		td {
			padding: 15px 0 5px 0;
		}
	}
`;

const HiddenTableCell = styled.td`
	padding: 5px 0;
	text-align: left;
	:last-child {
		text-align: right;
	}
`;

const HiddenTableCellContainer = styled.div`
	display: flex;
	align-items: center;
`;

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
});

export default connect(mapStateToProps, null)(HiddenContentTable);
