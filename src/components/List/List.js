import styled from 'styled-components';

export const List = styled.table`
	width: 100%;
	border-spacing: 0 5px;
`;
export const ListHead = styled.thead``;
export const ListBody = styled.tbody``;

export const ListHeaderRow = styled.tr`
	text-transform: uppercase;
	& > :last-child,
	& :nth-last-child(2) {
		text-align: right;
	}
`;

export const ListBodyRow = styled.tr`
	cursor: pointer;
	background-color: ${props => props.theme.colorStyles.panels};
	transition: transform 0.2s ease-in;
	:hover {
		transform: scale(1.02);
	}
`;

export const HeaderRow = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	text-transform: uppercase;
	& > :last-child,
	& :nth-last-child(2) {
		text-align: right;
	}
`;

export const ListHeaderCell = styled.th`
	padding: 10px 20px;
`;

export const ListCell = styled.td`
	padding: 0 10px;
	height: 30px;
	white-space: nowrap;
	border-top: 1px solid ${props => props.theme.colorStyles.borders};
	border-bottom: 1px solid ${props => props.theme.colorStyles.borders};
	:first-child {
		border-radius: 4px;
		border-left: 1px solid ${props => props.theme.colorStyles.borders};
	}
	:last-child {
		border-radius: 4px;
		border-right: 1px solid ${props => props.theme.colorStyles.borders};
	}
`;

export const BodyRow = styled.div`
	cursor: pointer;
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
	& :nth-last-child(2) {
		justify-content: flex-end;
	}
`;

export const HeaderCell = styled.div`
	padding: 0 20px;
	flex: 1;
`;

export const ExpandableRow = styled.div`
	height: ${props => (props.expanded ? 'auto' : '78px')};
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
