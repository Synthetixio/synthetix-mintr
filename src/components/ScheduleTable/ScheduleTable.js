import styled from 'styled-components';

export const TableHeader = styled.div`
  width: 100%;
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  text-transform: uppercase;
  padding: 0 20px;
`;

export const TableWrapper = styled.div`
  width: 100%;
  margin: 20px 0;
  height: 300px;
  overflow-y: scroll;
`;

export const Table = styled.table`
  width: 100%;
`;

export const TBody = styled.tbody`
  & > tr:nth-child(odd) {
    background-color: ${props => props.theme.colorStyles.escrowTableBackground};
  }
`;

export const TR = styled.tr`
  & > th,
  td {
    text-align: left;
    padding: 20px;
  }

  & > th:last-child,
  td:last-child {
    text-align: right;
  }
`;

export const TD = styled.td`
  height: 48px;
`;
