import React from 'react';
import styled from 'styled-components';
import { H1, H2 } from '../../components/Typography';
import { withTranslation } from 'react-i18next';

const MaintenanceMessage = ({ t }) => {
	return (
		<Container>
			<H1>{t('maintenance.title')}</H1>
			<H2>{t('maintenance.subtitle')}</H2>
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

export default withTranslation()(MaintenanceMessage);
