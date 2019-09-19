import React, { useContext } from 'react';
import styled from 'styled-components';
import { ButtonTertiary } from '../../components/Button';
import { Store } from '../../store';

const OnBoardingPageContainer = ({ children }) => {
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
          <ButtonTertiary>MAINNET</ButtonTertiary>
        </HeaderBlock>
        <HeaderBlock>
          <ButtonTertiary>What is Synthetix?</ButtonTertiary>
        </HeaderBlock>
      </Header>
      {children}
      <Footer>
        <ButtonTertiary>Having trouble?</ButtonTertiary>
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

export default OnBoardingPageContainer;
