import React from 'react';
import styled from 'styled-components';
import { DataHeaderSmall } from '../../components/typography';

const Table = ({ data, header }) => {
  return (
    <TableElement cellSpacing="0">
      <Thead>
        <Tr>
          {header.map((h, i) => (
            <Th key={i} alignRight={i >= header.length - 2}>
              <DataHeaderSmall>{h.value}</DataHeaderSmall>
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {data.map((d, i) => {
          return (
            <Tr key={i}>
              {header.map((h, i) => {
                const CellType = i === 0 ? HighlightedTd : Td;
                return (
                  <CellType key={i} alignRight={i >= header.length - 2}>
                    {d[h.key]}
                  </CellType>
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
  background-color: ${props => props.theme.colorStyles.borders};
  color: ${props => props.theme.colorStyles.body};
  font-size: 12px;
  text-transform: uppercase;
  font-family: 'apercu-bold';
`;

const Tbody = styled.tbody`
  color: ${props => props.theme.colorStyles.heading};
`;

const Th = styled.th`
  padding: 13px;
  text-align: ${props => (props.alignRight ? 'right' : 'left')};
`;

const Tr = styled.tr``;

const Td = styled.td`
  padding: 13px;
  font-size: 12px;
  font-family: 'apercu-medium';
  border-top: 1px solid ${props => props.theme.colorStyles.borders};
  text-align: ${props => (props.alignRight ? 'right' : 'left')};
  & :first-child {
    border-top: none;
  }
`;

const HighlightedTd = styled(Td)`
  font-family: 'apercu-bold';
  text-transform: uppercase;
`;

export default Table;
