/* eslint-disable */
import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { withTranslation, useTranslation } from 'react-i18next';
import { hasWeb3, SUPPORTED_WALLETS, onMetamaskAccountChange } from '../../helpers/networkHelper';
import { Store } from '../../store';
import { ButtonPrimary, ButtonSecondary, BorderlessButton } from '../../components/Button';
import { H1, H2, PMega, ButtonTertiaryLabel } from '../../components/Typography';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './styles.css';
import { Carousel } from 'react-responsive-carousel';
import { Welcome, WhatIsSynthetix, WhyStakeSnx, HowStakeSnx, Risks } from './Illustrations';

const SLIDE_COUNT = 4;

const OnBoardingCarousel = ({ pageIndex }) => {
	const { t } = useTranslation();
	return (
		<CarouselContainer>
			<Carousel
				selectedItem={pageIndex}
				showArrows={false}
				showThumbs={false}
				showStatus={false}
				interval={10000}
				autoplay
			>
				<CarouselSlide>
					<OnboardingH1>{t('onboarding.slides.welcome.title')}</OnboardingH1>
					<OnboardingPMega>{t('onboarding.slides.welcome.description')}</OnboardingPMega>
					<Welcome />
				</CarouselSlide>
				<CarouselSlide>
					<OnboardingH1>{t('onboarding.slides.whatIsSynthetix.title')}</OnboardingH1>
					<OnboardingPMega>{t('onboarding.slides.whatIsSynthetix.description')}</OnboardingPMega>
					<WhatIsSynthetix />
				</CarouselSlide>

				<CarouselSlide>
					<OnboardingH1>{t('onboarding.slides.whyStakeSnx.title')}</OnboardingH1>
					<OnboardingPMega>{t('onboarding.slides.whyStakeSnx.description')}</OnboardingPMega>
					<WhyStakeSnx />
				</CarouselSlide>

				<CarouselSlide>
					<OnboardingH1>{t('onboarding.slides.howStakeSnx.title')}</OnboardingH1>
					<OnboardingPMega>{t('onboarding.slides.howStakeSnx.description')}</OnboardingPMega>
					<HowStakeSnx />
				</CarouselSlide>
				<CarouselSlide>
					<OnboardingH1>{t('onboarding.slides.risks.title')}</OnboardingH1>
					<OnboardingPMega>{t('onboarding.slides.risks.description')}</OnboardingPMega>
					<Risks />
				</CarouselSlide>
			</Carousel>
		</CarouselContainer>
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

const Landing = ({ t }) => {
	const [pageIndex, setPageIndex] = useState(0);
	const {
		state: {
			ui: { themeIsDark },
		},
	} = useContext(Store);
	return (
		<LandingPageContainer>
			<OnboardingContainer>
				<Header>
					<Logo src={`/images/mintr-logo-${themeIsDark ? 'light' : 'dark'}.svg`} />
				</Header>
				<OnBoardingCarousel pageIndex={pageIndex} />
				<ButtonRow>
					<ButtonSecondary
						onClick={() => setPageIndex(Math.max(pageIndex - 1, 0))}
						height="64px"
						width="320px"
					>
						{t('button.previous')}
					</ButtonSecondary>
					<ButtonPrimary
						onClick={() => setPageIndex(pageIndex === SLIDE_COUNT ? 0 : pageIndex + 1)}
						height="64px"
						width="320px"
					>
						{pageIndex === SLIDE_COUNT ? t('button.startOver') : t('button.next')}
					</ButtonPrimary>
				</ButtonRow>
			</OnboardingContainer>
			<WalletConnectContainer>
				<PMega>{t('onboarding.walletConnection.title')}</PMega>
				<WalletButtons />
				<BottomLinks>
					<Link href="https://synthetix.io" target="_blank">
						<ButtonTertiaryLabel>{t('button.havingTrouble')}</ButtonTertiaryLabel>
					</Link>
					<Link href="https://synthetix.io" target="_blank">
						<ButtonTertiaryLabel>{t('button.whatIsSynthetix')}</ButtonTertiaryLabel>
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
	width: 100%;
	padding: 42px;
	background-color: ${props => props.theme.colorStyles.panels};
	border-right: 1px solid ${props => props.theme.colorStyles.borders};
`;

const CarouselContainer = styled.div`
	width: 854px;
	margin: 0 auto 50px auto;
	text-align: center;
	margin-top: 40px;
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
	text-transform: none;
	margin-bottom: 24px;
`;

const OnboardingPMega = styled(PMega)`
	margin: 20px auto 0 auto;
	font-size: 18px;
	line-height: 25px;
	width: 100%;
	max-width: 600px;
`;

const Illustration = styled.img`
	margin: 40px 0;
	width: 300px;
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
	width: 100%;
	margin: auto;
	justify-content: space-around;
	max-width: 800px;
`;

const WalletConnectContainer = styled.div`
	z-index: 100;
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
	height: 85px;
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
	font-size: 18px;
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
	height: 50px;
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

const CarouselSlide = styled.div`
	// background-color: ${props => props.theme.colorStyles.panelButton};
`;

const Header = styled.div`
	width: 100%;
`;

const Logo = styled.img`
	width: 120px;
	margin-right: 18px;
`;

export default withTranslation()(Landing);
