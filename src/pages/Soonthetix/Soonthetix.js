import React from 'react';
import styled from 'styled-components';
import { H1, H2 } from '../../components/Typography';
import { withTranslation } from 'react-i18next';

const MaintenanceMessage = ({ t }) => {
	return (
		<Container>
			<GradientText>Soonthetix.</GradientText>
		</Container>
	);
};

const Container = styled.div`
	height: 100vh;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
`;

const GradientText = styled(H1)`
	font-size: 46px;
	background: linear-gradient(130.52deg, #f49e25 -8.54%, #b252e9 101.04%);
	background-clip: text;
	background-size: 100%;
	background-repeat: repeat;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	-moz-background-clip: text;
	-moz-text-fill-color: transparent;
`;

export default withTranslation()(MaintenanceMessage);
