import React from 'react';
import styled from 'styled-components';

import { TableDataMedium, TableHeaderMedium } from '../Typography';

const List = ({ onClick }) => {
  return (
    <Table cellSpacing={0}>
      <THead>
        <TR>
          <TH>Address</TH>
          <TH>SNX Balance</TH>
          <TH>sUSD Balance</TH>
          <TH>ETH Balance</TH>
        </TR>
      </THead>
      <TBody>
        {[1, 2, 3, 4, 5, 6].map(i => {
          return (
            <TR key={i} onClick={onClick}>
              <TD>blah</TD>
              <TD>blah</TD>
              <TD>blah</TD>
              <TD>blah</TD>
            </TR>
          );
        })}
      </TBody>
    </Table>
  );
};

const Table = styled.table`
  width: 100%;
  color: white;
  border-collapse: separate;
  border-spacing: 0 8px;
`;

const THead = styled.thead`
  tr {
    height: 40px;
  }
`;

const TBody = styled.tbody`
  tr {
    background-color: ${props => props.theme.colorStyles.panels};
  }
  & tr:hover {
    background-color: ${props => props.theme.colorStyles.listBackgroundFocus};
    transform: scale(1.02);
    border-collapse: collapse;
    border-spacing: 0 8px;
  }
`;

const TR = styled.tr`
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
  text-align: right;
  cursor: pointer;
  & > td:first-child {
    border-left: 1px solid ${props => props.theme.colorStyles.borders};
  }
  & > td:last-child {
    border-right: 1px solid ${props => props.theme.colorStyles.borders};
  }
  & > th:first-child,
  td:first-child {
    text-align: left;
  }
`;

const TH = styled(TableHeaderMedium)`
  text-transform: uppercase;
  padding: 0 20px;
`;

const TD = styled(TableDataMedium)`
  padding: 0 20px;
  border-top: 1px solid ${props => props.theme.colorStyles.borders};
  border-bottom: 1px solid ${props => props.theme.colorStyles.borders};
  height: 56px;
`;

export default List;
