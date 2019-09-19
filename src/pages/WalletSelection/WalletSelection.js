import React, { useContext, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import snxJSConnector from '../../helpers/snxJSConnector';

import { bigNumberFormatter, formatCurrency } from '../../helpers/formatters';

import { Store } from '../../store';
import { updateCurrentPage } from '../../ducks/ui';
import { updateWalletStatus } from '../../ducks/wallet';

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
import OnBoardingPageContainer from '../../components/OnBoardingPageContainer';

import { H1, PMega, TableHeaderMedium } from '../../components/Typography';
import { ButtonPrimaryMedium } from '../../components/Button';

const WALLET_PAGE_SIZE = 5;

const useGetWallets = currentPage => {
  const { dispatch } = useContext(Store);
  const [wallets, setWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const walletIndex = currentPage * WALLET_PAGE_SIZE;
    if (wallets[walletIndex]) return;
    setIsLoading(true);
    const getWallets = async () => {
      try {
        const results = await snxJSConnector.signer.getNextAddresses(
          walletIndex,
          WALLET_PAGE_SIZE
        );

        const availableWallets = results.map(address => {
          return {
            address,
            balances: [],
          };
        });
        updateWalletStatus({ unlocked: true }, dispatch);
        setIsLoading(false);
        setWallets([...wallets, ...availableWallets]);
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

        setWallets([...wallets, ...availableWallets]);
      } catch (e) {
        setError('Please check your wallet is not in stand-by mode and retry.');
        updateWalletStatus(
          {
            unlocked: false,
            unlockReason: 'ErrorWhileConnectingToHardwareWallet',
            unlockMessage: e,
          },
          dispatch
        );
      }
    };
    getWallets();
  }, [currentPage]);
  return { wallets, isLoading, error };
};

const renderHeading = (hasLoaded, walletType, error) => {
  if (error) {
    return (
      <HeadingContent>
        <ErrorHeading>
          <ErrorImg src="/images/failure.svg" />
          <WalletConnectionH1>Error</WalletConnectionH1>
        </ErrorHeading>
        <WalletConnectionPMega>
          Mintr couldn't access your wallet
        </WalletConnectionPMega>
      </HeadingContent>
    );
  } else
    return hasLoaded ? (
      <HeadingContent>
        <WalletConnectionH1>Select Wallet</WalletConnectionH1>
        <WalletConnectionPMega>
          Please select the wallet you would like to use with Mintr
        </WalletConnectionPMega>
      </HeadingContent>
    ) : (
      <HeadingContent>
        <WalletConnectionH1>{`Connect via ${walletType}`}</WalletConnectionH1>
        <WalletConnectionPMega>
          Please follow the prompts on your device to unlock your wallet.
        </WalletConnectionPMega>
      </HeadingContent>
    );
};

const WalletConnection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { wallets, isLoading, error } = useGetWallets(currentPage);
  const {
    state: {
      wallet: { walletType },
    },
    dispatch,
  } = useContext(Store);
  return (
    <OnBoardingPageContainer>
      <Content>
        {renderHeading(wallets.length > 0, walletType, error)}
        {error ? (
          <ErrorContainer>
            <PMega>{error}</PMega>
            <ButtonPrimaryMedium
              onClick={() => updateCurrentPage('walletConnection', dispatch)}
            >
              Retry
            </ButtonPrimaryMedium>
          </ErrorContainer>
        ) : (
          <BodyContent>
            <ListContainer>
              {!isLoading ? (
                <ListInner>
                  <List cellSpacing={0}>
                    <ListHead>
                      <ListHeaderRow>
                        {['Address', 'SNX', 'sUSD', 'ETH'].map(
                          (headerElement, i) => {
                            return (
                              <ListHeaderCell
                                style={{ textAlign: i > 0 ? 'right' : 'left' }}
                                key={headerElement}
                              >
                                <TableHeaderMedium>
                                  {headerElement}
                                </TableHeaderMedium>
                              </ListHeaderCell>
                            );
                          }
                        )}
                      </ListHeaderRow>
                    </ListHead>
                    <ListBody>
                      {wallets
                        .slice(
                          currentPage * WALLET_PAGE_SIZE,
                          currentPage * WALLET_PAGE_SIZE + WALLET_PAGE_SIZE
                        )
                        .map(wallet => {
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
                                {formatCurrency(wallet.balances.snxBalance) ||
                                  0}
                              </ListCell>
                              <ListCell style={{ textAlign: 'right' }}>
                                {formatCurrency(wallet.balances.sUSDBalance) ||
                                  0}
                              </ListCell>
                              <ListCell style={{ textAlign: 'right' }}>
                                {formatCurrency(wallet.balances.ethBalance) ||
                                  0}
                              </ListCell>
                            </ListBodyRow>
                          );
                        })}
                    </ListBody>
                  </List>
                </ListInner>
              ) : (
                <Spinner />
              )}
            </ListContainer>
            {wallets.length > 0 ? (
              <Paginator
                disabled={isLoading}
                currentPage={currentPage}
                onPageChange={page => setCurrentPage(page)}
              />
            ) : null}
          </BodyContent>
        )}
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
  width: 100%;
  margin: 50px 0;
  max-width: 1400px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const ErrorContainer = styled.div`
  height: 350px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
`;

const ErrorImg = styled.img`
  margin-right: 20px;
`;

const ErrorHeading = styled.div`
  display: flex;
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
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

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const ListContainer = styled.div`
  height: 350px;
  width: 100%;
  display: flex;
  align-items: center;
`;

const ListInner = styled.div`
  animation: ${fadeIn} 0.2s linear both;
  width: 100%;
`;

export default WalletConnection;
