import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { getWalletDetails } from 'ducks/wallet';

import { PageTitle, PLarge, H2 } from 'components/Typography';
import PageContainer from 'components/PageContainer';

import MintrAction from '../../MintrActions';
import { ACTIONS } from 'constants/actions';
import { isMainNet } from 'helpers/networkHelper';
import { getRedirectToTrade } from 'ducks/ui';

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
	track: {
		description: 'home.actions.track.description',
		title: 'home.actions.track.title',
	},
};

const Home = ({ walletDetails: { networkId }, redirectToTrade }) => {
	const { t } = useTranslation();
	const [currentScenario, setCurrentScenario] = useState(
		redirectToTrade ? 'trade' : initialScenario
	);
	return (
		<PageContainer>
			<MintrAction action={currentScenario} onDestroy={() => setCurrentScenario(null)} />
			<PageTitle>{t('home.intro.title')}</PageTitle>
			<ButtonRow>
				{ACTIONS.map(action => {
					return (
						<Button
							disabled={action === 'track' && !isMainNet(networkId)}
							key={action}
							onClick={() => setCurrentScenario(action)}
							big
						>
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
	&:disabled {
		opacity: 0.5;
	}
`;

const ButtonContainer = styled.div`
	padding: 10px;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const ButtonRow = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 34px;
`;

const ActionImage = styled.img`
	height: 48px;
	width: 48px;
`;

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
	redirectToTrade: getRedirectToTrade(state),
});

export default connect(mapStateToProps, null)(Home);
