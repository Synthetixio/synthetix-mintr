import React from 'react';
import styled from 'styled-components';

const DebtChart = () => {
	return <Container>this is the chart</Container>;
};

const Container = styled.div`
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 2px;
`;

export default DebtChart;
