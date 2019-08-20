import React from 'react';
import styled from 'styled-components';
import { DataHeaderSmall, DataSmall } from '../../components/typography';

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
                const DataLabelType = i === 0 ? DataHeaderSmall : DataSmall;
                return (
                  <Td key={i} alignRight={i >= header.length - 2}>
                    <DataLabelType
                      style={{ textTransform: i === 0 ? 'uppercase' : 'none' }}
                    >
                      {d[h.key]}
                    </DataLabelType>
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

export default Table;
