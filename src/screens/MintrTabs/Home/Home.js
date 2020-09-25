import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { getWalletDetails } from 'ducks/wallet';

import { PageTitle, PLarge, H2, H4, PSmall } from 'components/Typography';
import PageContainer from 'components/PageContainer';
import Tooltip from 'components/Tooltip';
import { Info } from 'components/Icons';

import MintrAction from '../../MintrActions';
import { ACTIONS } from 'constants/actions';
import { isMainNet } from 'helpers/networkHelper';
import snxJSConnector from 'helpers/snxJSConnector';

const initialScenario = null;

const actionLabelMapper = {
	mint: { description: 'home.actions.mint.description', title: 'home.actions.mint.title' },
	burn: { description: 'home.actions.burn.description', title: 'home.actions.burn.title' },
	claim: { description: 'home.actions.claim.description', title: 'home.actions.claim.title' },
};

const DEFAULT_GAS_LIMIT = 8000000;

const Home = ({ walletDetails: { networkId } }) => {
	const { t } = useTranslation();
	const [currentScenario, setCurrentScenario] = useState(initialScenario);
	const [isMintSupplyDisabled, setIsMintSupplyDisabled] = useState(true);
	const [isCloseFeePeriodDisabled, setIsCloseFeePeriodDisabled] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const {
				snxJS: { SupplySchedule, FeePool },
			} = snxJSConnector;
			try {
				const [isMintable, feePeriodDuration, recentFeePeriods] = await Promise.all([
					SupplySchedule.isMintable(),
					FeePool.feePeriodDuration(),
					FeePool.recentFeePeriods(0),
				]);
				const now = Math.ceil(new Date().getTime() / 1000);
				const startTime = Number(recentFeePeriods.startTime);
				const duration = Number(feePeriodDuration);

				setIsMintSupplyDisabled(!isMintable);
				setIsCloseFeePeriodDisabled(now <= duration + startTime);
			} catch (e) {
				console.log(e);
				setIsMintSupplyDisabled(true);
				setIsCloseFeePeriodDisabled(true);
			}
		};
		fetchData();
	}, []);

	const onMintSupply = async () => {
		const {
			snxJS: { Synthetix },
		} = snxJSConnector;
		try {
			const tx = await Synthetix.mint({ gasLimit: DEFAULT_GAS_LIMIT, gasPrice: 0 });
			console.log(tx);
		} catch (e) {
			console.log(e);
		}
	};

	const onCloseFeePeriod = async () => {
		const {
			snxJS: { FeePool },
		} = snxJSConnector;
		try {
			const tx = await FeePool.closeCurrentFeePeriod({ gasLimit: DEFAULT_GAS_LIMIT, gasPrice: 0 });
			console.log(tx);
		} catch (e) {
			console.log(e);
		}
	};

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

			<ButtonRowSmall>
				<ButtonSmall onClick={onMintSupply} disabled={isMintSupplyDisabled}>
					<StyledImage src="/images/actions/inflate.svg" />
					<StyledH4>Mint the weekly SNX supply</StyledH4>
					<StyledPSmall>Inflate the SNX supply to reward all stakers for minting sUSD</StyledPSmall>
				</ButtonSmall>
				<ButtonSmall onClick={onCloseFeePeriod} disabled={isCloseFeePeriodDisabled}>
					<StyledImage src="/images/actions/close.svg" />
					<StyledH4>Close the current fee period</StyledH4>
					<StyledPSmall>To allow all stakers to claim their fees</StyledPSmall>
				</ButtonSmall>
			</ButtonRowSmall>
		</PageContainer>
	);
};

const StyledPSmall = styled(PLarge)`
	margin-top: 0;
	font-size: 14px;
`;

const StyledImage = styled.img`
	/* height: 80px; */
`;

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

const ButtonSmall = styled(Button)`
	height: auto;
	max-width: 100%;
`;

const StyledH2 = styled(H2)`
	margin-top: 0;
`;

const StyledH4 = styled(H4)`
	font-size: 16px;
	margin: 0 0 6px 0;
	text-transform: none;
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

const ButtonRowSmall = styled(ButtonRow)`
	grid-template-columns: repeat(2, 1fr);
	margin-top: 34px;
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
