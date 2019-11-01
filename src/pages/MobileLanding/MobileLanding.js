import React from 'react';
import styled from 'styled-components';
import { H1, H2 } from '../../components/Typography';
import { withTranslation } from 'react-i18next';

const MobileLanding = ({ t }) => {
	return (
		<Container>
			<H1>{t('mobileLanding.title')}</H1>
			<H2>{t('mobileLanding.subtitle')}</H2>
		</Container>
	);
};

const Container = styled.div`
	height: 100vh;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	padding: 0 20px;
`;

export default withTranslation()(MobileLanding);
