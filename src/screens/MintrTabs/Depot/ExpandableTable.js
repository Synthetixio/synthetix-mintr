import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { TableDataMedium, TableHeaderMedium } from '../../../components/Typography';
import { HeaderRow, BodyRow, Cell, HeaderCell, ExpandableRow } from '../../../components/List';
import { Plus, Minus } from '../../../components/Icons';
import HiddenTableContent from './HiddenTableContent';
import { formatCurrency } from '../../../helpers/formatters';

const ExpandableTable = ({ deposits }) => {
	const { t } = useTranslation();
	const [expandedElements, setExpanded] = useState([]);
	return (
		<List>
			<HeaderRow>
				{[
					'depot.table.type',
					'depot.table.amount',
					'depot.table.remaining',
					'depot.table.timeDate',
					'depot.table.details',
				].map(headerElement => {
					return (
						<HeaderCell key={headerElement}>
							<TableHeaderMedium>{t(headerElement)}</TableHeaderMedium>
						</HeaderCell>
					);
				})}
			</HeaderRow>
			{deposits.map((deposit, i) => {
				const isExpanded = expandedElements.includes(i);
				const hasDetails = deposit.details && deposit.details.length > 0;
				return (
					<ExpandableRow key={i} expanded={isExpanded}>
						<BodyRow
							key={i}
							onClick={() => {
								if (!hasDetails) return;
								setExpanded(currentExpandedState => {
									if (currentExpandedState.includes(i)) {
										return currentExpandedState.filter(state => state !== i);
									} else return [...currentExpandedState, i];
								});
							}}
						>
							<Cell>
								<TypeImage src="/images/actions/tiny-deposit.svg" />
								<TableDataMedium>{t('depot.table.deposit')}</TableDataMedium>
							</Cell>
							<Cell>
								<TableDataMedium>{formatCurrency(deposit.amount)} sUSD</TableDataMedium>
							</Cell>
							<Cell>
								<TableDataMedium>{formatCurrency(deposit.remaining)} sUSD</TableDataMedium>
							</Cell>
							<Cell>
								<TableDataMedium>{deposit.date}</TableDataMedium>
							</Cell>
							<Cell>
								{isExpanded ? <Minus /> : <Plus style={{ opacity: hasDetails ? '1' : '0.3' }} />}
							</Cell>
						</BodyRow>
						<HiddenTableContent deposits={deposit.details} />
					</ExpandableRow>
				);
			})}
		</List>
	);
};

const List = styled.div`
	width: 100%;
`;

const TypeImage = styled.img`
	width: 16px;
	height: 16px;
	margin-right: 8px;
`;

export default ExpandableTable;
