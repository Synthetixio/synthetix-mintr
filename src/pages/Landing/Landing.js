import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { Carousel } from 'react-responsive-carousel';
import { withTranslation, useTranslation } from 'react-i18next';

import snxJSConnector, { connectToWallet } from '../../helpers/snxJSConnector';

import { Store } from '../../store';
import { updateCurrentPage } from '../../ducks/ui';
import { updateWalletStatus } from '../../ducks/wallet';

import { hasWeb3, SUPPORTED_WALLETS, onMetamaskAccountChange } from '../../helpers/networkHelper';
// import { WhatIsSynthetix, WhyStakeSnx, HowStakeSnx, Risks } from './Illustrations';
import { ButtonPrimary, ButtonSecondary } from '../../components/Button';
import { H1, H2, PMega, ButtonTertiaryLabel } from '../../components/Typography';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './styles.css';

const SLIDE_COUNT = 4;

const onWalletClick = (wallet, dispatch) => {
	return async () => {
		const walletStatus = await connectToWallet(wallet);

		updateWalletStatus(walletStatus, dispatch);
		if (walletStatus && walletStatus.unlocked && walletStatus.currentWallet) {
			if (walletStatus.walletType === 'Metamask') {
				onMetamaskAccountChange(async () => {
					const address = await snxJSConnector.signer.getNextAddresses();
					const signer = new snxJSConnector.signers['Metamask']({});
					snxJSConnector.setContractSettings({
						networkId: walletStatus.networkId,
						signer,
					});
					if (address && address[0]) {
						updateWalletStatus({ currentWallet: address[0] }, dispatch);
					}
				});
			}
			updateCurrentPage('main', dispatch);
		} else updateCurrentPage('walletSelection', dispatch);
	};
};

const OnBoardingCarousel = ({ pageIndex }) => {
	const { t } = useTranslation();
	const {
		state: {
			ui: { themeIsDark },
		},
	} = useContext(Store);
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
					<OnboardingIllustration
						src={`/images/onboarding/welcome-${themeIsDark ? 'dark' : 'light'}.png`}
					/>
				</CarouselSlide>
				<CarouselSlide>
					<OnboardingH1>{t('onboarding.slides.whatIsSynthetix.title')}</OnboardingH1>
					<OnboardingPMega>{t('onboarding.slides.whatIsSynthetix.description')}</OnboardingPMega>
					<OnboardingIllustration
						src={`/images/onboarding/what-is-synthetix-${themeIsDark ? 'dark' : 'light'}.png`}
					/>
				</CarouselSlide>

				<CarouselSlide>
					<OnboardingH1>{t('onboarding.slides.whyStakeSnx.title')}</OnboardingH1>
					<OnboardingPMega>{t('onboarding.slides.whyStakeSnx.description')}</OnboardingPMega>
					<OnboardingIllustration
						src={`/images/onboarding/why-stake-${themeIsDark ? 'dark' : 'light'}.png`}
					/>
				</CarouselSlide>

				<CarouselSlide>
					<OnboardingH1>{t('onboarding.slides.howStakeSnx.title')}</OnboardingH1>
					<OnboardingPMega>{t('onboarding.slides.howStakeSnx.description')}</OnboardingPMega>
					<OnboardingIllustration
						src={`/images/onboarding/what-to-do-${themeIsDark ? 'dark' : 'light'}.png`}
					/>
				</CarouselSlide>
				<CarouselSlide>
					<OnboardingH1>{t('onboarding.slides.risks.title')}</OnboardingH1>
					<OnboardingPMega>{t('onboarding.slides.risks.description')}</OnboardingPMega>
					<OnboardingIllustration
						src={`/images/onboarding/risks-${themeIsDark ? 'dark' : 'light'}.png`}
					/>
				</CarouselSlide>
			</Carousel>
		</CarouselContainer>
	);
};

const WalletButtons = () => {
	const { dispatch } = useContext(Store);
	return (
		<Wallets>
			{SUPPORTED_WALLETS.map(wallet => {
				const noMetamask = wallet === 'Metamask' && !hasWeb3();
				return (
					<Button disabled={noMetamask} key={wallet} onClick={onWalletClick(wallet, dispatch)}>
						<Icon src={`images/wallets/${wallet}.svg`} />
						<WalletConnectionH2>{wallet}</WalletConnectionH2>
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
					<Link href="https://help.synthetix.io/hc/en-us" target="_blank">
						<ButtonTertiaryLabel>{t('button.havingTrouble')}</ButtonTertiaryLabel>
					</Link>
					<Link href="https://www.synthetix.io/uploads/synthetix_litepaper.pdf" target="_blank">
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

const OnboardingIllustration = styled.img`
	width: 60vw;
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

const CarouselSlide = styled.div``;

const Header = styled.div`
	width: 100%;
`;

const Logo = styled.img`
	width: 120px;
	margin-right: 18px;
`;

export default withTranslation()(Landing);
