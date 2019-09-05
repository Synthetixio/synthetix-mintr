import styled from 'styled-components';

export const List = styled.div`
  width: 100%;
`;

export const HeaderRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  text-transform: uppercase;
  & > :last-child {
    text-align: right;
  }
`;

export const BodyRow = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${props => (props.expanded ? '200px' : 'auto')};
  background-color: ${props => props.theme.colorStyles.panels};
  & > :first-child {
    border-left: 1px solid ${props => props.theme.colorStyles.borders};
  }
  & > :last-child {
    border-right: 1px solid ${props => props.theme.colorStyles.borders};
    justify-content: flex-end;
  }
  border-top: 1px solid ${props => props.theme.colorStyles.borders};
  border-bottom: 1px solid ${props => props.theme.colorStyles.borders};
`;

export const HeaderCell = styled.div`
  padding: 0 20px;
  flex: 1;
`;

export const ExpandableRow = styled.div`
  height: ${props => (props.expanded ? '255px' : '78px')};
  overflow: hidden;
  transition: height 0.2s ease-in-out;
`;

export const Cell = styled.div`
  padding: 0 20px;
  display: flex;
  align-items: center;
  height: 56px;
  text-align: left;
  white-space: nowrap;
  flex: 1;
`;
