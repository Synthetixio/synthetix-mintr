/* eslint-disable */
import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { withTranslation, useTranslation } from 'react-i18next';
import { hasWeb3, SUPPORTED_WALLETS, onMetamaskAccountChange } from '../../helpers/networkHelper';
import { Store } from '../../store';
import { ButtonPrimary, ButtonSecondary, BorderlessButton } from '../../components/Button';
import { H1, H2, PMega, ButtonTertiaryLabel } from '../../components/Typography';
// import OnBoardingPageContainer from '../../components/OnBoardingPageContainer';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

const OnBoardingCarousel = ({ pageIndex }) => {
	return (
		<Carousel
			selectedItem={pageIndex}
			showArrows={false}
			showThumbs={false}
			showStatus={false}
			interval={10000}
			autoplay
		>
			<div>
				<OnboardingH1>What is Synthetix?</OnboardingH1>
				<OnboardingPMega>
					Synthetix is a decentralised synthetic asset issuance protocol built on Ethereum. These
					synthetic assets (Synths) are created by staking the Synthetix Network Token (SNX). These
					Synths can be exchanged for each other directly with the Synthetix smart contracts on
					Synthetix.Exchange, avoiding the need for counterparties and solving the liquidity and
					slippage issues experienced by DEX’s.
				</OnboardingPMega>
				<img src="images/onboarding/slide-1.svg"></img>
			</div>
			<div>
				<OnboardingH1>What is Synthetix?</OnboardingH1>
				<OnboardingPMega>
					Synthetix is a decentralised synthetic asset issuance protocol built on Ethereum. These
					synthetic assets (Synths) are created by staking the Synthetix Network Token (SNX). These
					Synths can be exchanged for each other directly with the Synthetix smart contracts on
					Synthetix.Exchange, avoiding the need for counterparties and solving the liquidity and
					slippage issues experienced by DEX’s.
				</OnboardingPMega>
				<img src="images/onboarding/slide-1.svg"></img>
			</div>
		</Carousel>
	);
};

const WalletButtons = () => {
	const { dispatch } = useContext(Store);
	const { t } = useTranslation();
	return (
		<Wallets>
			{SUPPORTED_WALLETS.map(wallet => {
				const noMetamask = wallet === 'Metamask' && !hasWeb3();
				return (
					<Button disabled={noMetamask} key={wallet} onClick={null}>
						<Icon src={`images/wallets/${wallet}.svg`} />
						<WalletConnectionH2>{wallet}</WalletConnectionH2>
						{noMetamask ? (
							<PLarge mt={0}>({t('onboarding.walletConnection.intro.noMetamask')})</PLarge>
						) : null}
					</Button>
				);
			})}
		</Wallets>
	);
};

const Landing = () => {
	const [pageIndex, setPageIndex] = useState(0);
	return (
		<LandingPageContainer>
			<OnboardingContainer>
				<CarouselContent>
					<OnBoardingCarousel pageIndex={pageIndex} />
					<ButtonRow>
						<ButtonSecondary onClick={() => setPageIndex(Math.max(pageIndex - 1), 0)} width="45%">
							PREVIOUS
						</ButtonSecondary>
						<ButtonPrimary onClick={() => setPageIndex(pageIndex + 1)} width="45%">
							CONTINUE
						</ButtonPrimary>
					</ButtonRow>
				</CarouselContent>
			</OnboardingContainer>
			<WalletConnectContainer>
				<PMega>Please connect a wallet with your SNX holdings to start:</PMega>
				<WalletButtons />
				<BottomLinks>
					<Link href="https://synthetix.io" target="_blank">
						<ButtonTertiaryLabel>Having trouble?</ButtonTertiaryLabel>
					</Link>
					<Link href="https://synthetix.io" target="_blank">
						<ButtonTertiaryLabel>What is Synthetix?</ButtonTertiaryLabel>
					</Link>
				</BottomLinks>
			</WalletConnectContainer>
		</LandingPageContainer>
	);
};

const LandingPageContainer = styled.div`
	height: 100vh;
	display: flex;
`;

const OnboardingContainer = styled.div`
	height: 100%;
	width: 80%;
	padding: 64px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	background-color: ${props => props.theme.colorStyles.panels};
	border-right: 1px solid ${props => props.theme.colorStyles.borders};
`;

const CarouselContent = styled.div`
	width: 80%;
	margin: 0 auto;
	max-width: 1200px;
	text-align: center;
	height: 80%;
	align-items: center;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const Heading = styled.div`
	max-width: 1000px;
	margin: 0 auto;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
`;

const OnboardingH1 = styled(H1)`
	text-transform: capitalize;
	font-size: 48px;
	margin-bottom: 24px;
`;

const OnboardingPMega = styled(PMega)`
	font-size: 22px;
	font-family: 'apercu-regular';
	text-align: center;
	line-height: 32px;
`;

const Illustration = styled.img`
	margin: 128px auto 160px auto;
`;

const Progress = styled.div`
	display: flex;
`;

const Bubble = styled.div`
	background-color: ${props => props.theme.colorStyles.borders};
	height: 16px;
	width: 16px;
	border-radius: 100%;
	margin: 12px;
	cursor: pointer;
`;

const ButtonRow = styled.div`
	display: flex;
	width: 80%;
	margin: auto;
	justify-content: space-between;
`;

const WalletConnectContainer = styled.div`
	height: 100%;
	max-width: 500px;
	padding: 20px;
	text-align: center;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	background-color: ${props => props.theme.colorStyles.background};
`;

const Wallets = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
	width: 100%;
`;

const Button = styled.button`
	height: 120px;
	width: 300px;
	border-radius: 2px;
	padding: 16px 48px;
	margin: 10px 0;
	display: flex;
	justify-content: left;
	align-items: center;
	background-color: ${props => props.theme.colorStyles.panelButton};
	border: 1px solid ${props => props.theme.colorStyles.borders};
	box-shadow: 0px 5px 10px 5px ${props => props.theme.colorStyles.shadow1};
	opacity: ${props => (props.disabled ? '0.4' : 1)};
	cursor: pointer;
	transition: all 0.1s ease;
	:hover {
		background-color: ${props => props.theme.colorStyles.panelButtonHover};
	}
`;

const WalletConnectionH2 = styled(H2)`
	text-transform: capitalize;
	margin: 0;
	font-size: 22px;
`;

const Icon = styled.img`
	width: 40px;
	height: 40px;
	margin-right: 24px;
`;

const Link = styled.a`
	background-color: ${props => props.theme.colorStyles.buttonTertiaryBgFocus};
	border: 1px solid ${props => props.theme.colorStyles.borders};
	text-transform: uppercase;
	font-size: 32px;
	text-decoration: none;
	width: 300px;
	cursor: pointer;
	height: 64px;
	padding: 16px 20px;
	border-radius: 2px;
	margin: 10px 0;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const BottomLinks = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

// const LandingH2 = styled(H2)`
// 	text-transform: capitalize;
// 	font-size: 22px;
// 	margin: 30px 0px 16px 0px;
// `;

// const LandingPLarge = styled(PLarge)`
// 	font-size: 18px;
// 	font-family: 'apercu-regular';
// 	margin-top: 0;
// `;

// const Functionalities = styled.div`
// 	display: flex;
// 	width: 100%;
// 	margin: 80px auto 100px auto;
// 	justify-content: space-between;
// 	color: white;
// `;

// const Functionality = styled.div`
// 	display: flex;
// 	width: 100%;
// 	flex-direction: column;
// 	align-items: center;
// 	text-align: center;
// `;

// const Icon = styled.img`
// 	width: 64px;
// 	height: 64px;
// `;

export default withTranslation()(Landing);
