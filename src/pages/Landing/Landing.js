import React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import { ButtonPrimary, ButtonSecondary } from '../../components/Button';
import { H1, H2, PMega, ButtonTertiaryLabel } from '../../components/Typography';
// import OnBoardingPageContainer from '../../components/OnBoardingPageContainer';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

// Don't forget to include the css in your page
// <link rel="stylesheet" href="carousel.css"/>
// Begin DemoSliderControls

const DemoCarousel = () => {
	return (
		<Carousel>
			<div>
				<Heading>
					<OnboardingH1>What is Synthetix?</OnboardingH1>
					<OnboardingPMega>
						Synthetix is a decentralised synthetic asset issuance protocol built on Ethereum. These
						synthetic assets (Synths) are created by staking the Synthetix Network Token (SNX).
						These Synths can be exchanged for each other directly with the Synthetix smart contracts
						on Synthetix.Exchange, avoiding the need for counterparties and solving the liquidity
						and slippage issues experienced by DEX’s.
					</OnboardingPMega>
					<Illustration src="images/onboarding/slide-1.svg"></Illustration>
				</Heading>
			</div>
			<div>
				<Heading>
					<OnboardingH1>What is Synthetix?</OnboardingH1>
					<OnboardingPMega>
						Synthetix is a decentralised synthetic asset issuance protocol built on Ethereum. These
						synthetic assets (Synths) are created by staking the Synthetix Network Token (SNX).
						These Synths can be exchanged for each other directly with the Synthetix smart contracts
						on Synthetix.Exchange, avoiding the need for counterparties and solving the liquidity
						and slippage issues experienced by DEX’s.
					</OnboardingPMega>
					<Illustration src="images/onboarding/slide-1.svg"></Illustration>
				</Heading>
			</div>
		</Carousel>
	);
};

const Landing = () => {
	return (
		<LandingPageContainer>
			<OnboardingContainer>
				<CarouselContent>
					<DemoCarousel />
					<Heading>
						<OnboardingH1>What is Synthetix?</OnboardingH1>
						<OnboardingPMega>
							Synthetix is a decentralised synthetic asset issuance protocol built on Ethereum.
							These synthetic assets (Synths) are created by staking the Synthetix Network Token
							(SNX). These Synths can be exchanged for each other directly with the Synthetix smart
							contracts on Synthetix.Exchange, avoiding the need for counterparties and solving the
							liquidity and slippage issues experienced by DEX’s.
						</OnboardingPMega>
						<Illustration src="images/onboarding/slide-1.svg"></Illustration>
					</Heading>
					<Progress>
						<Bubble />
						<Bubble />
						<Bubble />
						<Bubble />
						<Bubble />
					</Progress>
					<ButtonRow>
						<ButtonSecondary width="45%">PREVIOUS</ButtonSecondary>
						<ButtonPrimary width="45%">CONTINUE</ButtonPrimary>
					</ButtonRow>
				</CarouselContent>
			</OnboardingContainer>
			<WalletConnectContainer>
				<PMega>Please connect a wallet with your SNX holdings to start:</PMega>
				<WalletTypes>
					<Button>
						<Icon src="images/wallets/metamask.svg" />
						<WalletConnectionH2>MetaMask</WalletConnectionH2>
					</Button>
					<Button>
						<Icon src="images/wallets/trezor.svg" />
						<WalletConnectionH2>Trezor</WalletConnectionH2>
					</Button>
					<Button>
						<Icon src="images/wallets/ledger.svg" />
						<WalletConnectionH2>Ledger</WalletConnectionH2>
					</Button>
					<Button>
						<Icon src="images/wallets/coinbase.svg" />
						<WalletConnectionH2>Coinbase</WalletConnectionH2>
					</Button>
				</WalletTypes>
				<Link href="https://synthetix.io" target="_blank">
					<ButtonTertiaryLabel>Having trouble?</ButtonTertiaryLabel>
				</Link>
				<Link href="https://synthetix.io" target="_blank">
					<ButtonTertiaryLabel>What is Synthetix?</ButtonTertiaryLabel>
				</Link>
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
	width: 20%;
	padding: 64px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: ${props => props.theme.colorStyles.background};
`;

const WalletTypes = styled.div`
	display: flex;
	flex-direction: column;
	height: 80vh;
	width: 100%;
	margin: 32px auto 0 auto;
`;

const Button = styled.button`
	height: 128px;
	width: 100%;
	border-radius: 2px;
	padding: 16px 48px;
	margin: 16px 0;
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
	font-size: 22px;
`;

const Icon = styled.img`
	width: 40px;
	height: 40px;
	margin-right: 24px;
`;

const Link = styled.a`
	background-color: ${props => props.theme.colorStyles.buttonTertiaryBgFocus};
	text-transform: uppercase;
	font-size: 32px;
	text-decoration: none;
	cursor: pointer;
	height: 48px;
	padding: 16px 20px;
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 2px;
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
