import React from 'react';
import styled from 'styled-components';

const Table = ({ data, header }) => {
  return (
    <TableElement cellSpacing="0">
      <Thead>
        {header.map((h, i) => (
          <Th alignRight={i >= header.length - 2}>{h.value}</Th>
        ))}
      </Thead>
      <Tbody>
        {data.map(d => {
          return (
            <Tr>
              {header.map((h, i) => {
                const CellType = i === 0 ? HighlightedTd : Td;
                return <CellType>{d[h.key]}</CellType>;
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
  background-color: #e8e7fd;
  color: #484697;
  font-size: 12px;
  text-transform: uppercase;
  font-family: 'apercu-bold';
`;

const Tbody = styled.tbody`
  color: #28275a;
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
  border-top: 1px solid #e8e7fd;
  & :first-child {
    border-top: none;
  }
`;

const HighlightedTd = styled(Td)`
  font-family: 'apercu-bold';
  text-transform: uppercase;
`;

export default Table;
