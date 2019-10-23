import React from 'react';
import styled from 'styled-components';
import { DataHeaderLarge, DataLarge } from '../Typography';

const Table = ({ data, header }) => {
	return (
		<TableElement cellSpacing="0">
			<Thead>
				<Tr>
					{header.map((h, i) => (
						<Th key={i} alignRight={i >= header.length - 2}>
							<DataHeaderLarge>{h.value}</DataHeaderLarge>
						</Th>
					))}
				</Tr>
			</Thead>
			<Tbody>
				{data.map((d, i) => {
					return (
						<Tr key={i}>
							{header.map((h, i) => {
								return (
									<Td key={i} alignRight={i >= header.length - 2}>
										<DataLarge>{d[h.key]}</DataLarge>
									</Td>
								);
							})}
						</Tr>
					);
				})}
			</Tbody>
		</TableElement>
	);
};

const TableElement = styled.table`
	width: 100%;
`;

const Thead = styled.thead`
	color: ${props => props.theme.colorStyles.body};
	font-size: 12px;
	text-transform: uppercase;
	font-family: 'apercu-bold';
`;

const Tbody = styled.tbody`
	color: ${props => props.theme.colorStyles.body};
	& > :nth-child(odd) {
		background-color: ${props => props.theme.colorStyles.listBackgroundFocus};
	}
`;

const Th = styled.th`
	padding: 0 13px 13px 13px;
	text-align: ${props => (props.alignRight ? 'right' : 'left')};
`;

const Tr = styled.tr`
	& > :first-child {
		border-top-left-radius: 2px;
		border-bottom-left-radius: 2px;
	}
	& > :last-child {
		border-top-right-radius: 2px;
		border-bottom-right-radius: 2px;
	}
`;

const Td = styled.td`
	padding: 0 15px;
	height: 40px;
	font-size: 12px;
	font-family: 'apercu-medium';
	text-align: ${props => (props.alignRight ? 'right' : 'left')};
	& :first-child {
		border-top: none;
	}
`;

export default Table;
