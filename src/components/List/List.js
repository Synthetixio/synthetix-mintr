import React from 'react';
import styled from 'styled-components';

const List = () => {
  return (
    <Table>
      <TR>
        <TD>blah</TD>
        <TD>blah</TD>
        <TD>blah</TD>
        <TD>blah</TD>
        <TD>blah</TD>
        <TD>blah</TD>
      </TR>
      <TR>
        <TD>blah</TD>
        <TD>blah</TD>
        <TD>blah</TD>
        <TD>blah</TD>
        <TD>blah</TD>
        <TD>blah</TD>
      </TR>
      <TR>
        <TD>blah</TD>
        <TD>blah</TD>
        <TD>blah</TD>
        <TD>blah</TD>
        <TD>blah</TD>
        <TD>blah</TD>
      </TR>
      <TR>
        <TD>blah</TD>
        <TD>blah</TD>
        <TD>blah</TD>
        <TD>blah</TD>
        <TD>blah</TD>
        <TD>blah</TD>
      </TR>
      <TR>
        <TD>blah</TD>
        <TD>blah</TD>
        <TD>blah</TD>
        <TD>blah</TD>
        <TD>blah</TD>
        <TD>blah</TD>
      </TR>
      <TR>
        <TD>blah</TD>
        <TD>blah</TD>
        <TD>blah</TD>
        <TD>blah</TD>
        <TD>blah</TD>
        <TD>blah</TD>
      </TR>
    </Table>
  );
};

const Table = styled.table`
  width: 100%;
  color: white;
`;
const TR = styled.tr`
  & :hover {
    td {
      transform: scale(1.2);
    }
  }
`;
const TD = styled.td``;

export default List;
