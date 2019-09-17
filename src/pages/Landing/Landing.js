import React, { useContext } from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import { Store } from '../../store';
import { updateCurrentPage } from '../../ducks/ui';

import { ButtonPrimary, ButtonTertiary } from '../../components/Button';
import { H1, H2, PMega, PLarge } from '../../components/Typography';

const Landing = ({ t }) => {
  const { state, dispatch } = useContext(Store);
  return (
    <LandingWrapper>
      <Header>
        <HeaderBlock>
          <Logo
            src={`/images/mintr-logo-${
              state.ui.themeIsDark ? 'light' : 'dark'
            }.svg`}
          />
          <ButtonTertiary>{t('landing.buttons.mainnet')}</ButtonTertiary>
        </HeaderBlock>
        <HeaderBlock>
          <ButtonTertiary>{t('landing.buttons.synthetix')}</ButtonTertiary>
        </HeaderBlock>
      </Header>
      <Content>
        <HeadingContent>
          <LandingH1>{t('landing.intro.h')}</LandingH1>
          <LandingPMega>{t('landing.intro.p')}</LandingPMega>
        </HeadingContent>
        <BodyContent>
          <Functionalities>
            <Functionality>
              <Icon src='images/actions/mint.svg' />
              <LandingH2>{t('landing.functionality.mintH')}</LandingH2>
              <LandingPLarge>{t('landing.functionality.mintP')}</LandingPLarge>
            </Functionality>
            <Functionality>
              <Icon src='images/actions/burn.svg' />
              <LandingH2>{t('landing.functionality.burnH')}</LandingH2>
              <LandingPLarge>{t('landing.functionality.burnP')}</LandingPLarge>
            </Functionality>
            <Functionality>
              <Icon src='images/actions/claim.svg' />
              <LandingH2>{t('landing.functionality.claimH')}</LandingH2>
              <LandingPLarge>{t('landing.functionality.claimP')}</LandingPLarge>
            </Functionality>
          </Functionalities>
          <ButtonPrimary
            onClick={() => updateCurrentPage('walletConnection', dispatch)}
          >
            {t('landing.buttons.connect')}
          </ButtonPrimary>
        </BodyContent>
      </Content>
    </LandingWrapper>
  );
};

const LandingWrapper = styled.div`
  padding: 42px;
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HeaderBlock = styled.div`
  display: flex;
`;

const Logo = styled.img`
  width: 104px;
  margin-right: 18px;
`;

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
`;

const LandingPMega = styled(PMega)`
  font-size: 22px;
  font-family: 'apercu-medium';
  text-align: center;
  line-height: 32px;
`;

const LandingPLarge = styled(PLarge)`
  font-size: 18px;
  font-family: 'apercu-medium';
  margin-top: 0;
`;

const Functionalities = styled.div`
  display: flex;
  width: 100%;
  margin: 80px auto 140px auto;
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
