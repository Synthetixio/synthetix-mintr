import React, { useContext, Fragment } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { formatDistanceToNow } from 'date-fns';

import { Store } from '../../store';

import { formatCurrency } from '../../helpers/formatters';
import {
  useGetBalances,
  useGetPrices,
  useGetRewardData,
  useGetDebtData,
  useGetSynthData,
} from './fetchData';

import Header from '../../components/Header';
import PieChart from '../../components/PieChart';
import Table from '../../components/Table';
import {
  DataLarge,
  DataSmall,
  DataHeaderLarge,
  H5,
  Figure,
  ButtonTertiaryLabel,
} from '../../components/Typography';
import { Info } from '../../components/Icons';
import Skeleton from '../../components/Skeleton';

const Balances = ({ state }) => {
  const { balances, prices, theme, isLoading = true } = state;
  return (
    <BalanceRow>
      {['snx', 'sUSD', 'eth'].map(currency => {
        const currencyUnit =
          currency === 'sUSD' ? currency : currency.toUpperCase();
        return (
          <BalanceItem key={currency}>
            <CurrencyIcon src={`/images/${currency}-icon.svg`} />
            <Balance>
              {!isLoading ? (
                <DataHeaderLarge>
                  {formatCurrency(balances[currency]) || '--'}
                  {currencyUnit}
                </DataHeaderLarge>
              ) : (
                <Skeleton />
              )}
              {!isLoading ? (
                <DataHeaderLarge color={theme.colorStyles.buttonTertiaryText}>
                  ${formatCurrency(prices[currency]) || '--'} {currencyUnit}
                </DataHeaderLarge>
              ) : (
                <Skeleton />
              )}
            </Balance>
          </BalanceItem>
        );
      })}
    </BalanceRow>
  );
};

const RewardInfo = ({ state }) => {
  const { rewardData, theme, isLoading = true } = state;
  let content = <div />;
  if (isLoading) return <Skeleton />;
  if (rewardData.feesAreClaimable) {
    content = rewardData.feesAreClaimable ? (
      <DataLarge>
        <Highlighted>
          {rewardData.currentPeriodEnd
            ? formatDistanceToNow(rewardData.currentPeriodEnd)
            : '--'}{' '}
        </Highlighted>{' '}
        left to claim rewards
      </DataLarge>
    ) : (
      <DataLarge>
        Claiming rewards <Highlighted red={true}>blocked</Highlighted>
      </DataLarge>
    );
  }
  return (
    <Row padding="0px 8px">
      {content}
      <Info theme={theme} />
    </Row>
  );
};

const CollRatios = ({ state }) => {
  const { debtData, isLoading = true } = state;
  return (
    <Row margin="0 0 22px 0">
      <Box>
        {isLoading ? (
          <Skeleton style={{ marginBottom: '8px' }} height="25px" />
        ) : (
          <Figure>
            {debtData.currentCRatio
              ? Math.round(100 / debtData.currentCRatio)
              : '--'}
            %
          </Figure>
        )}
        <DataLarge>Current collateralization ratio</DataLarge>
      </Box>
      <Box>
        {isLoading ? (
          <Skeleton style={{ marginBottom: '8px' }} height="25px" />
        ) : (
          <Figure>
            {debtData.targetCRatio
              ? Math.round(100 / debtData.targetCRatio)
              : '--'}
            %
          </Figure>
        )}
        <DataLarge>Target collateralization ratio</DataLarge>
      </Box>
    </Row>
  );
};

const Pie = ({ state }) => {
  const { balances, debtData, theme, isLoading = true } = state;
  const snxLocked =
    balances.snx &&
    debtData.currentCRatio &&
    debtData.targetCRatio &&
    balances.snx * Math.min(1, debtData.currentCRatio / debtData.targetCRatio);

  const hasAllPieValues = snxLocked && debtData.transferable;

  return (
    <Box full={true}>
      <Row padding="32px 16px">
        {isLoading ? (
          <Skeleton width={'160px'} height={'160px'} curved={true} />
        ) : (
          <PieChart
            data={[
              {
                name: 'staking',
                value: hasAllPieValues ? snxLocked : 0,
                color: theme.colorStyles.accentLight,
              },
              {
                name: 'transferable',
                value: hasAllPieValues ? debtData.transferable : 0,
                color: theme.colorStyles.accentDark,
              },
            ]}
          />
        )}
        <PieChartLegend>
          <DataHeaderLarge margin="0px 0px 24px 0px">
            YOUR SNX HOLDINGS:
          </DataHeaderLarge>
          <LegendRow style={{ backgroundColor: theme.colorStyles.accentLight }}>
            {isLoading ? (
              <Skeleton width={'100%'} height={'45px'} />
            ) : (
              <Fragment>
                <DataLarge>{formatCurrency(snxLocked)} SNX</DataLarge>
                <DataSmall>STAKING</DataSmall>
              </Fragment>
            )}
          </LegendRow>

          <LegendRow style={{ backgroundColor: theme.colorStyles.accentDark }}>
            {isLoading ? (
              <Skeleton width={'100%'} height={'45px'} />
            ) : (
              <Fragment>
                <DataLarge>{debtData.transferable} SNX</DataLarge>
                <DataSmall>TRANSFERABLE</DataSmall>
              </Fragment>
            )}
          </LegendRow>
        </PieChartLegend>
      </Row>
    </Box>
  );
};

const processTableData = state => {
  const { balances, prices, debtData, synthData } = state;
  return [
    {
      rowLegend: 'balance',
      snx: balances.snx ? formatCurrency(balances.snx) : '--',
      sUSD: balances.sUSD ? formatCurrency(balances.sUSD) : '--',
      eth: balances.eth ? formatCurrency(balances.eth) : '--',
      synths: synthData.total ? formatCurrency(synthData.total) + 'sUSD' : '--',
      debt: debtData.debtBalance
        ? formatCurrency(debtData.debtBalance) + 'sUSD'
        : '--',
    },
    {
      rowLegend: '$ USD',
      snx: balances.snx ? formatCurrency(balances.snx * prices.snx) : '--',
      sUSD: balances.sUSD ? formatCurrency(balances.sUSD * prices.sUSD) : '--',
      eth: balances.eth ? formatCurrency(balances.eth * prices.eth) : '--',
      synths: synthData.total
        ? formatCurrency(synthData.total * prices.sUSD)
        : '--',
      debt: debtData.debtBalance
        ? formatCurrency(debtData.debtBalance * prices.sUSD)
        : '--',
    },
  ];
};

const BalanceTable = ({ state }) => {
  const { isLoading = true } = state;
  const data = processTableData(state);
  return (
    <Row margin="22px 0 0 0">
      {isLoading ? (
        <Skeleton width={'100%'} height={'130px'} />
      ) : (
        <Table
          header={[
            { key: 'rowLegend', value: '' },
            { key: 'snx', value: 'snx' },
            { key: 'sUSD', value: 'susd' },
            { key: 'eth', value: 'eth' },
            { key: 'synths', value: 'synths' },
            { key: 'debt', value: 'debt' },
          ]}
          data={data}
        />
      )}
    </Row>
  );
};

const Dashboard = () => {
  const theme = useContext(ThemeContext);
  const {
    state: {
      wallet: { currentWallet },
    },
  } = useContext(Store);

  const balances = useGetBalances(currentWallet);
  const prices = useGetPrices();
  const rewardData = useGetRewardData(currentWallet);
  const debtData = useGetDebtData(currentWallet);
  const synthData = useGetSynthData(currentWallet);

  return (
    <DashboardWrapper>
      <Header currentWallet={currentWallet} />
      <Content>
        <Container>
          <ContainerHeader>
            <H5>Current Balances & Prices:</H5>
          </ContainerHeader>
          <Balances state={{ balances, prices, theme }} />
        </Container>
        <Container curved={true}>
          <RewardInfo state={{ rewardData, theme }} />
        </Container>
        <Container>
          <ContainerHeader>
            <H5>Wallet Details:</H5>
            <DataHeaderLarge
              margin="0px 0px 22px 0px"
              color={theme.colorStyles.body}
            ></DataHeaderLarge>
          </ContainerHeader>
          <CollRatios state={{ debtData }} />
          <Pie state={{ balances, debtData, theme }} />
          <BalanceTable state={{ balances, synthData, debtData, prices }} />
          <Row margin="18px 0 0 0 ">
            <Link href="https://synthetix.exchange" target="_blank">
              <ButtonTertiaryLabel>
                Go to Synthetix.Exchange
              </ButtonTertiaryLabel>
            </Link>
            <Link>
              <ButtonTertiaryLabel>
                View your Synths balance
              </ButtonTertiaryLabel>
            </Link>
          </Row>
        </Container>
      </Content>
    </DashboardWrapper>
  );
};

const DashboardWrapper = styled('div')`
  background: ${props => props.theme.colorStyles.panels};
  width: 623px;
  h1 {
    color: ${props => props.theme.colorStyles.heading};
    margin: 0;
  }
  p {
    color: ${props => props.theme.colorStyles.body};
    margin: 0;
  }
  // transition: all ease-out 0.5s;
  flex-shrink: 0;
  border-right: 1px solid ${props => props.theme.colorStyles.borders};
`;

const Content = styled('div')`
  padding: 0 32px;
`;

const Container = styled.div`
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-radius: ${props => (props.curved ? '40px' : '5px')};
  padding: ${props => (props.curved ? '15px' : '32px 24px')};
  margin: ${props => (props.curved ? '16px 0' : '0')};
`;

const BalanceRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BalanceItem = styled.div`
  display: flex;
  align-items: center;
`;

const CurrencyIcon = styled.img`
  width: 40px;
  height: 40px;
`;

const Balance = styled.div`
  font-family: 'apercu-medium';
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  & :first-child {
    margin-bottom: 8px;
  }
`;

const ContainerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: ${props => (props.margin ? props.margin : 0)};
  padding: ${props => (props.padding ? props.padding : 0)};
`;

const Highlighted = styled.span`
  font-family: 'apercu-bold';
  color: ${props =>
    props.red
      ? props.theme.colorStyles.brandRed
      : props.theme.colorStyles.hyperlink};
`;

const Box = styled.div`
  border-radius: 2px;
  border: 1px solid ${props => props.theme.colorStyles.borders};
  width: ${props => (props.full ? '100%' : '240px')};
  height: ${props => (props.full ? '100%' : '96px')};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PieChartLegend = styled.div`
  flex: 1;
  margin-left: 18px;
`;

const LegendRow = styled.div`
  margin-top: 16px;
  height: 45px;
  display: flex;
  align-items: center;
  border-radius: 2px;
  justify-content: space-between;
`;

const Link = styled.a`
  background-color: ${props => props.theme.colorStyles.buttonTertiaryBgFocus};
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  height: 48px;
  padding: 16px 20px;
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-radius: 2px;
`;

export default Dashboard;
