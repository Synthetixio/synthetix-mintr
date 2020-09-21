import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { getWalletDetails } from 'ducks/wallet';

import { PageTitle, PLarge, H2 } from 'components/Typography';
import PageContainer from 'components/PageContainer';
import Tooltip from 'components/Tooltip';
import { Info } from 'components/Icons';

import MintrAction from '../../MintrActions';
import { ACTIONS } from 'constants/actions';
import { isMainNet } from 'helpers/networkHelper';

const initialScenario = null;

const actionLabelMapper = {
	mint: { description: 'home.actions.mint.description', title: 'home.actions.mint.title' },
	burn: { description: 'home.actions.burn.description', title: 'home.actions.burn.title' },
	claim: { description: 'home.actions.claim.description', title: 'home.actions.claim.title' },
};

const Home = ({ walletDetails: { networkId } }) => {
	const { t } = useTranslation();
	const [currentScenario, setCurrentScenario] = useState(initialScenario);
	return (
		<PageContainer>
			<MintrAction action={currentScenario} onDestroy={() => setCurrentScenario(null)} />
			{/* <InfoBanner>
				<InfoBannerCountdown>
					Withdraw funds from L1 in:<Countdown>3 days 22 hours</Countdown>
				</InfoBannerCountdown>
				<Tooltip mode={null} title={'tooltip content'} placement="top">
					<IconContainer>
						<Info />
					</IconContainer>
				</Tooltip>
			</InfoBanner> */}
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
								<StyledH2>{t(actionLabelMapper[action].title)}</StyledH2>
								<PLarge>{t(actionLabelMapper[action].description)}</PLarge>
							</ButtonContainer>
						</Button>
					);
				})}
			</ButtonRow>
		</PageContainer>
	);
};

const InfoBanner = styled.div`
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 5px;
	padding: 10px 16px;
	margin-bottom: 16px;
	display: flex;
	flex-direction: row;
	border-radius: 20px;
	margin-bottom: 42px;
	color: #ffffff;
	text-transform: uppercase;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const InfoBannerCountdown = styled.div`
	display: flex;
`;

const Countdown = styled.div`
	margin-left: 5px;
	background: linear-gradient(130.52deg, #f49e25 -8.54%, #b252e9 101.04%);
	background-clip: text;
	background-size: 100%;
	background-repeat: repeat;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	-moz-background-clip: text;
	-moz-text-fill-color: transparent;
`;

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

const StyledH2 = styled(H2)`
	margin-top: 0;
`;

const ButtonContainer = styled.div`
	padding: 10px;
	margin: 0 auto;
	height: 100%;
`;

const ButtonRow = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 34px;
`;

const ActionImage = styled.img`
	height: 164px;
	width: 164px;
`;

const IconContainer = styled.div`
	margin-left: 10px;
	width: 23px;
	height: 23px;
`;

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
});

export default connect(mapStateToProps, null)(Home);
