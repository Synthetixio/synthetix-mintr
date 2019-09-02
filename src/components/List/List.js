import styled from 'styled-components';

import { TableDataMedium, TableHeaderMedium } from '../Typography';

export const List = styled.table`
  width: 100%;
  color: white;
  border-collapse: separate;
  border-spacing: 0 8px;
`;

export const THead = styled.thead`
  tr {
    height: 40px;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
`;

export const TBody = styled.tbody`
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

export const TR = styled.tr`
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

export const TH = styled(TableHeaderMedium)`
  text-transform: uppercase;
  padding: 0 20px;
`;

export const TD = styled(TableDataMedium)`
  padding: 0 20px;
  border-top: 1px solid ${props => props.theme.colorStyles.borders};
  border-bottom: 1px solid ${props => props.theme.colorStyles.borders};
  height: 56px;
  width: auto;
`;
