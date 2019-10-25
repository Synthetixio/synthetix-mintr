import React, { useState } from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import { PageTitle, PLarge, H1, H2, PMega } from '../../../components/Typography';
import PageContainer from '../../../components/PageContainer';

import MintrAction from '../../MintrActions';

const initialScenario = null;

const actionLabelMapper = {
	mint: { description: 'home.actions.mint.description', title: 'home.actions.mint.title' },
	burn: { description: 'home.actions.burn.description', title: 'home.actions.burn.title' },
	claim: { description: 'home.actions.claim.description', title: 'home.actions.claim.title' },
	trade: { description: 'home.actions.trade.description', title: 'home.actions.trade.title' },
	transfer: {
		description: 'home.actions.transfer.description',
		title: 'home.actions.transfer.title',
	},
};

const Home = ({ t }) => {
	const [currentScenario, setCurrentScenario] = useState(initialScenario);
	return (
		<PageContainer>
			<MintrAction action={currentScenario} onDestroy={() => setCurrentScenario(null)} />
			<PageTitle>{t('home.intro.title')}</PageTitle>
			<PLarge>{t('home.intro.subtitle')}</PLarge>
			<ButtonRow margin="30px 0 40px 0">
				{['mint', 'burn'].map(action => {
					return (
						<Button key={action} onClick={() => setCurrentScenario(action)} big>
							<ButtonContainer>
								<ActionImage src={`/images/actions/${action}.svg`} big />
								<H1>{t(actionLabelMapper[action].title)}</H1>
								<PMega>{t(actionLabelMapper[action].description)}</PMega>
							</ButtonContainer>
						</Button>
					);
				})}
			</ButtonRow>
			<ButtonRow margin="0 0 40px 0">
				{['claim', 'trade', 'transfer'].map(action => {
					return (
						<Button key={action} onClick={() => setCurrentScenario(action)}>
							<ButtonContainer>
								<ActionImage src={`/images/actions/${action}.svg`} />
								<H2>{t(actionLabelMapper[action].title)}</H2>
								<PLarge>{t(actionLabelMapper[action].description)}</PLarge>
							</ButtonContainer>
						</Button>
					);
				})}
			</ButtonRow>
		</PageContainer>
	);
};

const Button = styled.button`
	flex: 1;
	cursor: pointer;
	height: 352px;
	max-width: ${props => (props.big ? '336px' : '216px')};
	background-color: ${props => props.theme.colorStyles.panelButton};
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 5px;
	box-shadow: 0px 5px 10px 5px ${props => props.theme.colorStyles.shadow1};
	transition: transform ease-in 0.2s;
	&:hover {
		background-color: ${props => props.theme.colorStyles.panelButtonHover};
		box-shadow: 0px 5px 10px 8px ${props => props.theme.colorStyles.shadow1};
		transform: translateY(-2px);
	}
`;

const ButtonContainer = styled.div`
	max-width: 140px;
	margin: 0 auto;
`;

const ButtonRow = styled.div`
	display: flex;
	justify-content: space-between;
	margin: ${props => (props.margin ? props.margin : 0)};
`;

const ActionImage = styled.img`
	height: ${props => (props.big ? '64px' : '48px')};
	width: ${props => (props.big ? '64px' : '48px')};
`;

export default withTranslation()(Home);
