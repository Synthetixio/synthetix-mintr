import styled from 'styled-components';

export const TableHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  text-transform: uppercase;
  padding: 0;
`;

export const TableWrapper = styled.div`
  width: 100%;
  margin: 16px 0;
  height: ${props => (props.height ? props.height : '300px')};
  overflow-y: scroll;
`;

export const Table = styled.table`
  width: 100%;
`;

export const THead = styled.thead`
  background-color: ${props => props.theme.colorStyles.borders};
`;

export const TBody = styled.tbody``;

export const TR = styled.tr`
  & > th,
  td {
    text-align: left;
  }
  & > th:last-child,
  td:last-child {
    text-align: right;
  }
`;

export const TH = styled.th`
  padding: ${props => (props.padding ? props.padding : '20px')};
  & > * {
    white-space: nowrap;
  }
`;

export const TD = styled.td`
  white-space: nowrap;
  height: 40px;
  padding: ${props => (props.padding ? props.padding : '20px')};
  border-top: 1px solid ${props => props.theme.colorStyles.borders};
`;
