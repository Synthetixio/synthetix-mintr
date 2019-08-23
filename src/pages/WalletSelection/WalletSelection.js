import React, { useContext, Fragment } from 'react';
import styled from 'styled-components';

import { Store } from '../../store';
import { updateCurrentPage } from '../../ducks/ui';

import { ButtonTertiary } from '../../components/Button';
import Spinner from '../../components/Spinner';
import List from '../../components/List';
import Paginator from '../../components/Paginator';

import { H1, PMega } from '../../components/Typography';

const renderBodyContent = (state, dispatch) => {
  return (
    <BodyContent>
      {state ? (
        <Spinner />
      ) : (
        <Fragment>
          <List onClick={() => updateCurrentPage('main', dispatch)} />
          <Paginator />
        </Fragment>
      )}
    </BodyContent>
  );
};

const WalletConnection = () => {
  const { state, dispatch } = useContext(Store);
  return (
    <Wrapper>
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
          <WalletConnectionH1>Connect via Ledger</WalletConnectionH1>
          <WalletConnectionPMega>
            Please Connect and Unlock your Trezor.
          </WalletConnectionPMega>
        </HeadingContent>
        {renderBodyContent(true, dispatch)}
        <Footer>
          <ButtonTertiary>Having trouble?</ButtonTertiary>
        </Footer>
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
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
  margin: 50px 0;
  max-width: 1400px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const Content = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Footer = styled.div`
  bottom: 40px;
`;

const WalletConnectionH1 = styled(H1)`
  text-transform: none;
  font-size: 48px;
`;

const WalletConnectionPMega = styled(PMega)`
  font-size: 22px;
  font-family: 'apercu-medium';
  text-align: center;
  line-height: 32px;
`;

export default WalletConnection;
