import React from 'react';
import styled from 'styled-components';

import { DataHeaderLarge } from '../Typography';

const DataBox = ({ heading, body }) => {
	return (
		<Box>
			<DataHeaderLarge>{heading}</DataHeaderLarge>
			<Amount>{body}</Amount>
		</Box>
	);
};

const Box = styled.div`
	flex: 1;
	padding: 18px;
	white-space: nowrap;
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 2px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	&:not(:first-child) {
		margin-left: 16px;
	}
`;

const Amount = styled.span`
	color: ${props => props.theme.colorStyles.hyperlink};
	font-family: 'apercu-medium';
	font-size: 18px;
	margin: 16px 0px 0px 0px;
`;

export default DataBox;
