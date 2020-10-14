import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Carousel } from 'react-responsive-carousel';
import { useTranslation } from 'react-i18next';

import snxJSConnector, { connectToWallet } from '../../helpers/snxJSConnector';

import { setCurrentPage } from '../../ducks/ui';
import { updateWalletStatus, getWalletDetails } from '../../ducks/wallet';
import { getCurrentTheme } from '../../ducks/ui';

import {
	hasWeb3,
	SUPPORTED_WALLETS,
	onMetamaskAccountChange,
	SUPPORTED_WALLETS_MAP,
} from '../../helpers/networkHelper';
import { ButtonPrimary, ButtonSecondary } from '../../components/Button';
import { H1, H2, PMega, ButtonTertiaryLabel } from '../../components/Typography';
import Logo from '../../components/Logo';

import { Globe } from '../../components/Icons';

import { LanguageDropdown } from '../../components/Dropdown';

import { PAGES_BY_KEY } from '../../constants/ui';
import { LINKS } from 'constants/links';
import { ExternalLink } from 'styles/common';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './carousel.css';

const SLIDE_COUNT = 4;

const onWalletClick = ({ wallet, derivationPath, updateWalletStatus, setCurrentPage }) => {
	return async () => {
		const walletStatus = await connectToWallet({ wallet, derivationPath });
		updateWalletStatus({ ...walletStatus, availableWallets: [] });
		if (walletStatus && walletStatus.unlocked && walletStatus.currentWallet) {
			if (walletStatus.walletType === SUPPORTED_WALLETS_MAP.METAMASK) {
				onMetamaskAccountChange(async () => {
					const address = await snxJSConnector.signer.getNextAddresses();
					const signer = new snxJSConnector.signers[SUPPORTED_WALLETS_MAP.METAMASK]({});
					snxJSConnector.setContractSettings({
						networkId: walletStatus.networkId,
						signer,
					});
					if (address && address[0]) {
						updateWalletStatus({ currentWallet: address[0] });
					}
				});
			}
			setCurrentPage(PAGES_BY_KEY.MAIN);
		} else setCurrentPage(PAGES_BY_KEY.WALLET_SELECTION);
	};
};

const OnBoardingCarousel = ({ pageIndex, setPageIndex, currentTheme }) => {
	const { t } = useTranslation();
	return (
		<CarouselContainer>
			<Carousel
				selectedItem={pageIndex}
				showArrows={false}
				showThumbs={false}
				showStatus={false}
				interval={10000}
				onChange={position => setPageIndex(position)}
				autoplay
			>
				<CarouselSlide>
					<OnboardingH1>{t('onboarding.slides.welcome.title')}</OnboardingH1>
					<OnboardingPMega>{t('onboarding.slides.welcome.description')}</OnboardingPMega>
					<OnboardingIllustration
						style={{ marginTop: '20px' }}
						src={`/images/onboarding/welcome-${currentTheme ? 'dark' : 'light'}.png`}
					/>
				</CarouselSlide>
				<CarouselSlide>
					<OnboardingH1>{t('onboarding.slides.whatIsSynthetix.title')}</OnboardingH1>
					<OnboardingPMega>{t('onboarding.slides.whatIsSynthetix.description')}</OnboardingPMega>
					<OnboardingIllustration
						src={`/images/onboarding/what-is-synthetix-${currentTheme ? 'dark' : 'light'}.png`}
					/>
				</CarouselSlide>

				<CarouselSlide>
					<OnboardingH1>{t('onboarding.slides.whyStakeSnx.title')}</OnboardingH1>
					<OnboardingPMega>{t('onboarding.slides.whyStakeSnx.description')}</OnboardingPMega>
					<OnboardingIllustration
						src={`/images/onboarding/why-stake-${currentTheme ? 'dark' : 'light'}.png`}
					/>
				</CarouselSlide>

				<CarouselSlide>
					<OnboardingH1>{t('onboarding.slides.howStakeSnx.title')}</OnboardingH1>
					<OnboardingPMega>{t('onboarding.slides.howStakeSnx.description')}</OnboardingPMega>
					<OnboardingIllustration
						src={`/images/onboarding/what-to-do-${currentTheme ? 'dark' : 'light'}.png`}
					/>
				</CarouselSlide>
				<CarouselSlide>
					<OnboardingH1>{t('onboarding.slides.risks.title')}</OnboardingH1>
					<OnboardingPMega>{t('onboarding.slides.risks.description')}</OnboardingPMega>
					<OnboardingIllustration
						src={`/images/onboarding/risks-${currentTheme ? 'dark' : 'light'}.png`}
					/>
				</CarouselSlide>
			</Carousel>
		</CarouselContainer>
	);
};

const Landing = ({ currentTheme, walletDetails, updateWalletStatus, setCurrentPage }) => {
	const { t } = useTranslation();
	const [pageIndex, setPageIndex] = useState(0);
	const [flagDropdownIsVisible, setFlagVisibility] = useState(false);
	const { derivationPath } = walletDetails;
	return (
		<LandingPageContainer>
			<OnboardingContainer>
				<Header>
					<Logo />
					<LanguageButtonWrapper>
						<RoundButton onClick={() => setFlagVisibility(true)}>
							<Globe />
						</RoundButton>
						<LanguageDropdown
							isVisible={flagDropdownIsVisible}
							setIsVisible={setFlagVisibility}
							position={{ right: 0 }}
						/>
					</LanguageButtonWrapper>
				</Header>
				<OnBoardingCarousel
					pageIndex={pageIndex}
					setPageIndex={setPageIndex}
					currentTheme={currentTheme}
				/>
				<ButtonRow>
					<ButtonSecondary
						onClick={() => setPageIndex(Math.max(pageIndex - 1, 0))}
						height="56px"
						width="280px"
					>
						{t('button.previous')}
					</ButtonSecondary>
					<ButtonPrimary
						onClick={() => setPageIndex(pageIndex === SLIDE_COUNT ? 0 : pageIndex + 1)}
						height="56px"
						width="280px"
					>
						{pageIndex === SLIDE_COUNT ? t('button.startOver') : t('button.next')}
					</ButtonPrimary>
				</ButtonRow>
			</OnboardingContainer>
			<WalletConnectContainer>
				<Wallets>
					<PMega m={'10px 0 20px 0'}>{t('onboarding.walletConnection.title')}</PMega>
					{SUPPORTED_WALLETS.map(wallet => {
						const noMetamask = wallet === 'Metamask' && !hasWeb3();
						return (
							<Button
								disabled={noMetamask}
								key={wallet}
								onClick={onWalletClick({
									wallet,
									derivationPath,
									updateWalletStatus,
									setCurrentPage,
								})}
							>
								<Icon src={`images/wallets/${wallet.toLowerCase()}.svg`} />
								<WalletConnectionH2>{wallet}</WalletConnectionH2>
							</Button>
						);
					})}
				</Wallets>
				<BottomLinks>
					<Link href={LINKS.Support} target="_blank">
						<ButtonTertiaryLabel>{t('button.havingTrouble')}</ButtonTertiaryLabel>
					</Link>
					<Link href={'https://docs.synthetix.io/litepaper/'} target="_blank">
						<ButtonTertiaryLabel>{t('button.whatIsSynthetix')}</ButtonTertiaryLabel>
					</Link>
					<ExternalLink
						href={`https://github.com/Synthetixio/synthetix-mintr/releases/tag/v${process.env.REACT_APP_VERSION}`}
					>
						<VersionLabel>v{process.env.REACT_APP_VERSION}</VersionLabel>
					</ExternalLink>
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
	width: 70%;
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
	padding: 32px;
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
	height: 80px;
	width: 100%;
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
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const RoundButton = styled.button`
	margin: 0 5px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 30px;
	padding: 0;
	height: 40px;
	width: 40px;
	border: 1px solid ${props => props.theme.colorStyles.borders};
	background-color: ${props => props.theme.colorStyles.buttonTertiaryBgFocus};
`;

const LanguageButtonWrapper = styled.div`
	position: relative;
`;

const VersionLabel = styled.div`
	text-align: right;
	font-size: 12px;
	margin-top: 5px;
	color: ${props => props.theme.colorStyles.body};
	text-decoration: underline;
`;

const mapStateToProps = state => ({
	currentTheme: getCurrentTheme(state),
	walletDetails: getWalletDetails(state),
});

const mapDispatchToProps = {
	setCurrentPage,
	updateWalletStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
