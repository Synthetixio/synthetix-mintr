import React from 'react';
import styled from 'styled-components';
import { PMedium } from '../Typography';

import { formatCurrency } from '../../helpers/formatters';

const BarChart = ({ data }) => {
	const [dataLeft, dataRight] = data;
	const total = Math.max(dataLeft.value, dataRight.value);
	return (
		<Container>
			<Bar style={{ width: Math.max((100 * dataLeft.value) / total, 1) + '%' }}>
				<LabelLeft>
					<PMedium style={{ fontFamily: 'apercu-medium' }}>
						{dataLeft.label}: {formatCurrency(dataLeft.value)}
					</PMedium>
				</LabelLeft>
			</Bar>
			<Bar style={{ width: Math.max((100 * dataRight.value) / total, 1) + '%' }}>
				<LabelRight>
					<PMedium style={{ fontFamily: 'apercu-medium' }}>
						{dataRight.label}: {formatCurrency(dataRight.value)}
					</PMedium>
				</LabelRight>
			</Bar>
		</Container>
	);
};

const Container = styled.div`
	position: relative;
	display: flex;
	margin-top: 40px;
	width: 100%;
	& > :first-child {
		background-color: ${props => props.theme.colorStyles.accentLight};
		border-top-left-radius: 2px;
		border-bottom-left-radius: 2px;
	}
	& > :last-child {
		background-color: ${props => props.theme.colorStyles.accentDark};
		border-top-right-radius: 2px;
		border-bottom-right-radius: 2px;
	}
`;

const Bar = styled.div`
	width: 50%;
	height: 20px;
	transition: width 0.5s ease-in-out;
`;

const Label = styled.div`
	position: absolute;
	top: -100%;
`;

const LabelLeft = styled(Label)`
	left: 0;
`;

const LabelRight = styled(Label)`
	right: 0;
`;

export default BarChart;
