import React, { useContext, Fragment, useState, useEffect } from 'react';
import styled from 'styled-components';
import snxJSConnector from '../../helpers/snxJSConnector';

import { bigNumberFormatter, formatCurrency } from '../../helpers/formatters';

import { Store } from '../../store';
import { updateCurrentPage } from '../../ducks/ui';
import { updateWalletStatus } from '../../ducks/wallet';

import { ButtonTertiary } from '../../components/Button';
import Spinner from '../../components/Spinner';
import {
  List,
  ListHead,
  ListBody,
  ListHeaderRow,
  ListBodyRow,
  ListCell,
  ListHeaderCell,
} from '../../components/List';
import Paginator from '../../components/Paginator';

import { H1, PMega, TableHeaderMedium } from '../../components/Typography';

const WALLET_PAGE_SIZE = 5;

const Wallets = ({ wallets }) => {
  const { dispatch } = useContext(Store);
  if (!wallets) return <Spinner />;
  return (
    <Fragment>
      <List cellSpacing={0}>
        <ListHead>
          <ListHeaderRow>
            {['Address', 'SNX', 'sUSD', 'ETH'].map((headerElement, i) => {
              return (
                <ListHeaderCell
                  style={{ textAlign: i > 0 ? 'right' : 'left' }}
                  key={headerElement}
                >
                  <TableHeaderMedium>{headerElement}</TableHeaderMedium>
                </ListHeaderCell>
              );
            })}
          </ListHeaderRow>
        </ListHead>
        <ListBody>
          {wallets.map(wallet => {
            return (
              <ListBodyRow
                key={wallet.address}
                onClick={() => {
                  updateWalletStatus(
                    {
                      currentWallet: wallet.address,
                    },
                    dispatch
                  );
                  updateCurrentPage('main', dispatch);
                }}
              >
                <ListCell>{wallet.address}</ListCell>
                <ListCell style={{ textAlign: 'right' }}>
                  {formatCurrency(wallet.balances.snxBalance) || 0}
                </ListCell>
                <ListCell style={{ textAlign: 'right' }}>
                  {formatCurrency(wallet.balances.sUSDBalance) || 0}
                </ListCell>
                <ListCell style={{ textAlign: 'right' }}>
                  {formatCurrency(wallet.balances.ethBalance) || 0}
                </ListCell>
              </ListBodyRow>
            );
          })}
        </ListBody>
      </List>
      <Paginator />
    </Fragment>
  );
};

const useGetWallets = () => {
  const { dispatch } = useContext(Store);
  const [wallets, setWallets] = useState(null);
  useEffect(() => {
    try {
      const getWallets = async () => {
        const results = await snxJSConnector.signer.getNextAddresses(
          0,
          WALLET_PAGE_SIZE
        );
        const availableWallets = results.map(address => {
          return {
            address,
            balances: [],
          };
        });
        updateWalletStatus({ unlocked: true }, dispatch);
        setWallets(availableWallets);
        const balances = await Promise.all(
          availableWallets.map(async wallet => {
            return {
              snxBalance: await snxJSConnector.snxJS.Synthetix.collateral(
                wallet.address
              ),
              sUSDBalance: await snxJSConnector.snxJS.sUSD.balanceOf(
                wallet.address
              ),
              ethBalance: await snxJSConnector.provider.getBalance(
                wallet.address
              ),
            };
          })
        );
        availableWallets.forEach((wallet, index) => {
          wallet.balances = {
            snxBalance: bigNumberFormatter(balances[index].snxBalance),
            sUSDBalance: bigNumberFormatter(balances[index].sUSDBalance),
            ethBalance: bigNumberFormatter(balances[index].ethBalance),
          };
        });

        setWallets(availableWallets.slice());
      };
      getWallets();
    } catch (e) {
      updateWalletStatus({
        unlocked: false,
        unlockReason: 'ErrorWhileConnectingToHardwareWallet',
        unlockMessage: e,
      });
    }
  }, []);
  return wallets;
};

const WalletConnection = () => {
  const {
    state: {
      ui: { themeIsDark },
    },
  } = useContext(Store);
  const wallets = useGetWallets();

  return (
    <Wrapper>
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
      <Content>
        <HeadingContent>
          <WalletConnectionH1>Connect via Ledger</WalletConnectionH1>
          <WalletConnectionPMega>
            Please Connect and Unlock your Trezor.
          </WalletConnectionPMega>
        </HeadingContent>
        <BodyContent>
          <Wallets wallets={wallets} />
        </BodyContent>
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
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
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
