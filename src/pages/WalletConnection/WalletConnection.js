import React, { useContext } from 'react';
import styled from 'styled-components';

import { Store } from '../../store';
import { updateCurrentPage } from '../../ducks/ui';

import { ButtonPrimaryMedium, ButtonTertiary } from '../../components/Button';
import { H1, H2, PMega } from '../../components/Typography';

const Landing = () => {
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
          <ButtonTertiary>Mainnet</ButtonTertiary>
        </HeaderBlock>
        <HeaderBlock>
          <ButtonTertiary>What is Synthetix?</ButtonTertiary>
        </HeaderBlock>
      </Header>
      <Content>
        <HeadingContent>
          <LandingH1>Connect Wallet</LandingH1>
          <LandingPMega>
            Please connect a wallet with your SNX holdings to continue.
          </LandingPMega>
        </HeadingContent>
        <BodyContent>
          <Wallet>
            <Icon src="images/wallets/metamask.svg" />
            <LandingH2>Metamask</LandingH2>
            <ButtonPrimaryMedium
              onClick={() => updateCurrentPage('walletSelection', dispatch)}
            >
              connect
            </ButtonPrimaryMedium>
          </Wallet>
          <Wallet>
            <Icon src="images/wallets/trezor.svg" />
            <LandingH2>Trezor</LandingH2>
            <ButtonPrimaryMedium
              onClick={() => updateCurrentPage('walletSelection', dispatch)}
            >
              connect
            </ButtonPrimaryMedium>
          </Wallet>
          <Wallet>
            <Icon src="images/wallets/ledger.svg" />
            <LandingH2>Ledger</LandingH2>
            <ButtonPrimaryMedium
              onClick={() => updateCurrentPage('walletSelection', dispatch)}
            >
              connect
            </ButtonPrimaryMedium>
          </Wallet>
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
  width: 100%;
  margin: 100px auto 0 auto;
  max-width: 1400px;
  text-align: center;
  display: flex;
  justify-content: space-between;
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
  margin: 40px 0;
`;

const LandingPMega = styled(PMega)`
  font-size: 22px;
  font-family: 'apercu-medium';
  text-align: center;
  line-height: 32px;
`;

const Wallet = styled.div`
  background-color: ${props => props.theme.colorStyles.panels};
  display: flex;
  width: 340px;
  height: 340px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  text-align: center;
  border: 1px solid ${props => props.theme.colorStyles.borders};
`;

const Icon = styled.img`
  width: 80px;
  height: 80px;
`;

export default Landing;
