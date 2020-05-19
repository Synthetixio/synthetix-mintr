import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useTable, useFlexLayout, useSortBy } from 'react-table';

import Spinner from '../../components/Spinner';

import { ReactComponent as SortDownIcon } from '../../assets/images/sort-down.svg';
import { ReactComponent as SortUpIcon } from '../../assets/images/sort-up.svg';
import { ReactComponent as SortIcon } from '../../assets/images/sort.svg';

import { TABLE_PALETTE } from './constants';
import { FlexDivCentered } from '../../styles/common';

export const Table = ({
	columns = [],
	columnsDeps = [],
	data = [],
	options = {},
	noResultsMessage = null,
	onTableRowClick = undefined,
	palette = TABLE_PALETTE.PRIMARY,
	isLoading = false,
	className,
}) => {
	const memoizedColumns = useMemo(
		() => columns,
		// eslint-disable-next-line react-hooks/exhaustive-deps
		columnsDeps
	);
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
		{
			columns: memoizedColumns,
			data,
			...options,
		},
		useSortBy,
		useFlexLayout
	);

	return (
		<ReactTable {...getTableProps()} palette={palette} className={className}>
			{headerGroups.map(headerGroup => (
				<TableRow className="table-row" {...headerGroup.getHeaderGroupProps()}>
					{headerGroup.headers.map(column => (
						<TableCellHead
							{...column.getHeaderProps(
								column.sortable ? column.getSortByToggleProps() : undefined
							)}
						>
							{column.render('Header')}
							{column.sortable && (
								<SortIconContainer>
									{column.isSorted ? (
										column.isSortedDesc ? (
											<SortDownIcon />
										) : (
											<SortUpIcon />
										)
									) : (
										<SortIcon />
									)}
								</SortIconContainer>
							)}
						</TableCellHead>
					))}
				</TableRow>
			))}
			{noResultsMessage != null ? (
				noResultsMessage
			) : isLoading ? (
				<Spinner size="sm" fullscreen={true} />
			) : (
				<TableBody className="table-body" {...getTableBodyProps()}>
					{rows.map(row => {
						prepareRow(row);

						return (
							<TableBodyRow
								className="table-body-row"
								{...row.getRowProps()}
								onClick={onTableRowClick ? () => onTableRowClick(row) : undefined}
							>
								{row.cells.map(cell => (
									<TableCell className="table-body-cell" {...cell.getCellProps()}>
										{cell.render('Cell')}
									</TableCell>
								))}
							</TableBodyRow>
						);
					})}
				</TableBody>
			)}
		</ReactTable>
	);
};

export const TableRow = styled.div``;

const TableBody = styled.div`
	overflow-y: auto;
	overflow-x: hidden;
`;

const TableBodyRow = styled(TableRow)`
	cursor: ${props => (props.onClick ? 'pointer' : 'default')};
`;

const TableCell = styled(FlexDivCentered)`
	box-sizing: border-box;
	&:first-child {
		padding-left: 18px;
	}
	&:last-child {
		padding-right: 18px;
	}
`;

const TableCellHead = styled(TableCell)`
	user-select: none;
	text-transform: uppercase;
`;

const SortIconContainer = styled.span`
	display: flex;
	align-items: center;
	margin-left: 5px;
`;

const ReactTable = styled.div`
	width: 100%;
	height: 100%;
	overflow-x: auto;
	position: relative;

	${props =>
		props.palette === TABLE_PALETTE.STRIPED &&
		css`
			${TableBody} {
				max-height: calc(100% - 48px);
			}
			${TableCell} {
				color: ${props => props.theme.colorStyles.tableBody};
				font-size: 14px;
				height: 40px;
				&:last-child {
					justify-content: flex-end;
				}
			}
			${TableCellHead} {
				color: ${props => props.theme.colorStyles.body};
				font-family: 'apercu-bold';
				background-color: ${props => props.theme.colorStyles.surfaceL3};
			}
			${TableBodyRow} {
				&:nth-child(odd) {
					background-color: ${props => props.theme.colorStyles.listBackgroundFocus};
				}
			}
		`}

	${props =>
		props.palette === TABLE_PALETTE.LIGHT &&
		css`
			${TableBody} {
				max-height: calc(100% - 56px);
			}
			${TableCell} {
				font-size: 14px;

				height: 56px;
			}
			${TableRow} {
				margin-bottom: 8px;
			}
			${TableCellHead} {
				font-family: ${props => props.theme.fonts.bold};
				font-size: 12px;
			}
			${TableBodyRow} {
				&:hover {
					transition: box-shadow 0.2s ease-in-out;
					box-shadow: rgba(188, 99, 255, 0.08) 0px 4px 6px;
				}
			}
		`}
`;

export default Table;
