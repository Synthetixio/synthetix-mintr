import React, { useContext } from 'react';
import styled from 'styled-components';
import { ButtonTertiary } from '../../components/Button';
import { Store } from '../../store';
import { withTranslation } from 'react-i18next';

const OnBoardingPageContainer = ({ t, children }) => {
  const {
    state: {
      ui: { themeIsDark },
    },
  } = useContext(Store);
  return (
    <PageContainer>
      <Header>
        <HeaderBlock>
          <Logo
            src={`/images/mintr-logo-${themeIsDark ? 'light' : 'dark'}.svg`}
          />
          <ButtonTertiary>{t('onboarding.buttons.mainnet')}</ButtonTertiary>
        </HeaderBlock>
        <HeaderBlock>
          <ButtonTertiary>{t('onboarding.buttons.synthetix')}</ButtonTertiary>
        </HeaderBlock>
      </Header>
      {children}
      <Footer>
        <ButtonTertiary>{t('onboarding.buttons.support')}</ButtonTertiary>
      </Footer>
    </PageContainer>
  );
};

const PageContainer = styled.div`
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

const Footer = styled.div`
  width: 100%;
  display: flex;
  margin-top: 50px;
  justify-content: center;
  bottom: 40px;
`;

export default withTranslation()(OnBoardingPageContainer);
