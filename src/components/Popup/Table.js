import styled from 'styled-components';

export const Table = styled.table`
	width: 100%;
`;

export const Thead = styled.thead`
	color: ${props => props.theme.colorStyles.body};
	font-size: 12px;
	text-transform: uppercase;
	font-family: 'apercu-bold', sans-serif;
`;

export const Tbody = styled.tbody`
	color: ${props => props.theme.colorStyles.body};
	& > :nth-child(odd) {
		background-color: ${props => props.theme.colorStyles.listBackgroundFocus};
	}
`;

export const Th = styled.th`
	padding: 0 13px 13px 13px;
	text-align: left;
	&:last-child {
		text-align: right;
	}
`;

export const Tr = styled.tr`
	& > :first-child {
		border-top-left-radius: 2px;
		border-bottom-left-radius: 2px;
	}
	& > :last-child {
		border-top-right-radius: 2px;
		border-bottom-right-radius: 2px;
	}
`;

export const Td = styled.td`
	padding: 0 15px;
	height: 40px;
	font-size: 14px;
	font-family: 'apercu-regular', sans-serif;
	text-align: left;
	&:last-child {
		text-align: right;
	}
	& :first-child {
		border-top: none;
	}
`;

export default Table;
