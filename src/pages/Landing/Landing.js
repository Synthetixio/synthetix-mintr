import React, { useContext } from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import { Store } from '../../store';
import { updateCurrentPage } from '../../ducks/ui';

import { ButtonPrimary } from '../../components/Button';
import { H1, H2, PMega, PLarge } from '../../components/Typography';
import OnBoardingPageContainer from '../../components/OnBoardingPageContainer';

const Landing = ({ t }) => {
	const { dispatch } = useContext(Store);
	return (
		<OnBoardingPageContainer>
			<Content>
				<HeadingContent>
					<LandingH1>{t('onboarding.landing.intro.title')}</LandingH1>
					<LandingPMega>{t('onboarding.landing.intro.subtitle')}</LandingPMega>
				</HeadingContent>
				<BodyContent>
					<Functionalities>
						<Functionality>
							<Icon src="images/actions/mint.svg" />
							<LandingH2>{t('onboarding.landing.functionality.mint.title')}</LandingH2>
							<LandingPLarge>
								{t('onboarding.landing.functionality.mint.description')}
							</LandingPLarge>
						</Functionality>
						<Functionality>
							<Icon src="images/actions/burn.svg" />
							<LandingH2>{t('onboarding.landing.functionality.burn.title')}</LandingH2>
							<LandingPLarge>
								{t('onboarding.landing.functionality.burn.description')}
							</LandingPLarge>
						</Functionality>
						<Functionality>
							<Icon src="images/actions/claim.svg" />
							<LandingH2>{t('onboarding.landing.functionality.claim.title')}</LandingH2>
							<LandingPLarge>
								{t('onboarding.landing.functionality.claim.description')}
							</LandingPLarge>
						</Functionality>
					</Functionalities>
					<ButtonPrimary onClick={() => updateCurrentPage('walletConnection', dispatch)}>
						{t('onboarding.landing.buttons.connect')}
					</ButtonPrimary>
				</BodyContent>
			</Content>
		</OnBoardingPageContainer>
	);
};

const HeadingContent = styled.div`
	width: 50%;
	max-width: 600px;
	margin: 0 auto;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
`;

const BodyContent = styled.div`
	width: 80%;
	margin: 0 auto;
	max-width: 1200px;
	text-align: center;
`;

const Content = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const LandingH1 = styled(H1)`
	text-transform: capitalize;
	font-size: 48px;
`;

const LandingH2 = styled(H2)`
	text-transform: capitalize;
	font-size: 22px;
	margin: 30px 0px 16px 0px;
`;

const LandingPMega = styled(PMega)`
	font-size: 22px;
	font-family: 'apercu-regular';
	text-align: center;
	line-height: 32px;
`;

const LandingPLarge = styled(PLarge)`
	font-size: 18px;
	font-family: 'apercu-regular';
	margin-top: 0;
`;

const Functionalities = styled.div`
	display: flex;
	width: 100%;
	margin: 80px auto 100px auto;
	justify-content: space-between;
	color: white;
`;

const Functionality = styled.div`
	display: flex;
	width: 100%;
	flex-direction: column;
	align-items: center;
	text-align: center;
`;

const Icon = styled.img`
	width: 64px;
	height: 64px;
`;

export default withTranslation()(Landing);
