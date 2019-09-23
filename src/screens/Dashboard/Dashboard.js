import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { formatDistanceToNow } from 'date-fns';
import { withTranslation, useTranslation, Trans } from 'react-i18next';

import { Store } from '../../store';

import { formatCurrency } from '../../helpers/formatters';
import { useFetchData } from './fetchData';

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
  const { balances, prices, theme, dashboardIsLoading } = state;
  return (
    <BalanceRow>
      {['snx', 'sUSD', 'eth'].map(currency => {
        const currencyUnit =
          currency === 'sUSD' ? currency : currency.toUpperCase();
        return (
          <BalanceItem key={currency}>
            <CurrencyIcon src={`/images/currencies/${currency}.svg`} />
            <Balance>
              {!dashboardIsLoading ? (
                <DataHeaderLarge>
                  {formatCurrency(balances[currency]) || '--'}
                  {currencyUnit}
                </DataHeaderLarge>
              ) : (
                <Skeleton />
              )}
              {!dashboardIsLoading ? (
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
  const { rewardData, theme, dashboardIsLoading } = state;
  const { t } = useTranslation();
  if (dashboardIsLoading) return <Skeleton />;
  const content = !rewardData.feesAreClaimable ? (
    <DataLarge>
      <Highlighted>
        {rewardData.currentPeriodEnd
          ? formatDistanceToNow(rewardData.currentPeriodEnd)
          : '--'}
      </Highlighted>{' '}
      {t('dashboard.rewards.claimable')}
    </DataLarge>
  ) : (
    <DataLarge>
      <Trans i18nKey="dashboard.rewards.blocked">
        Claiming rewards <Highlighted red={true}>blocked</Highlighted>
      </Trans>
    </DataLarge>
  );

  return (
    <Row padding="0px 8px">
      {content}
      <Info theme={theme} />
    </Row>
  );
};

const CollRatios = ({ state }) => {
  const { debtData, dashboardIsLoading } = state;
  const { t } = useTranslation();
  return (
    <Row margin="0 0 22px 0">
      <Box>
        {dashboardIsLoading ? (
          <Skeleton style={{ marginBottom: '8px' }} height="25px" />
        ) : (
          <Figure>
            {debtData.currentCRatio
              ? Math.round(100 / debtData.currentCRatio)
              : '--'}
            %
          </Figure>
        )}
        <DataLarge>{t('dashboard.ratio.current')}</DataLarge>
      </Box>
      <Box>
        {dashboardIsLoading ? (
          <Skeleton style={{ marginBottom: '8px' }} height="25px" />
        ) : (
          <Figure>
            {debtData.targetCRatio
              ? Math.round(100 / debtData.targetCRatio)
              : '--'}
            %
          </Figure>
        )}
        <DataLarge>{t('dashboard.ratio.target')}</DataLarge>
      </Box>
    </Row>
  );
};

const Pie = ({ state }) => {
  const { t } = useTranslation();
  const { balances, debtData, theme, dashboardIsLoading } = state;
  const snxLocked =
    balances.snx &&
    debtData.currentCRatio &&
    debtData.targetCRatio &&
    balances.snx * Math.min(1, debtData.currentCRatio / debtData.targetCRatio);

  return (
    <Box full={true}>
      <Row padding="32px 16px">
        {dashboardIsLoading ? (
          <Skeleton width={'160px'} height={'160px'} curved={true} />
        ) : (
          <PieChart
            data={[
              {
                name: t('dashboard.holdings.staked'),
                value: snxLocked,
                color: theme.colorStyles.accentLight,
              },
              {
                name: t('dashboard.holdings.transferable'),
                value: debtData.transferable,
                color: theme.colorStyles.accentDark,
              },
            ]}
          />
        )}
        <PieChartLegend>
          <DataHeaderLarge margin="0px 0px 24px 0px">
            {t('dashboard.sections.holdings')}
          </DataHeaderLarge>
          {dashboardIsLoading ? (
            <Skeleton
              style={{ marginTop: '16px' }}
              width={'100%'}
              height={'45px'}
            />
          ) : (
            <LegendRow
              style={{ backgroundColor: theme.colorStyles.accentLight }}
            >
              <DataLarge>{formatCurrency(snxLocked)} SNX</DataLarge>
              <DataSmall style={{ textTransform: 'uppercase' }}>
                {t('dashboard.holdings.staked')}
              </DataSmall>
            </LegendRow>
          )}
          {dashboardIsLoading ? (
            <Skeleton
              style={{ marginTop: '16px' }}
              width={'100%'}
              height={'45px'}
            />
          ) : (
            <LegendRow
              style={{ backgroundColor: theme.colorStyles.accentDark }}
            >
              <DataLarge>{formatCurrency(debtData.transferable)} SNX</DataLarge>
              <DataSmall style={{ textTransform: 'uppercase' }}>
                {t('dashboard.holdings.transferable')}
              </DataSmall>
            </LegendRow>
          )}
        </PieChartLegend>
      </Row>
    </Box>
  );
};

const processTableData = (state, t) => {
  const { balances, prices, debtData, synthData } = state;
  return [
    {
      rowLegend: t('dashboard.table.balance'),
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
  const { t } = useTranslation();
  const { dashboardIsLoading } = state;
  const data = processTableData(state, t);
  return (
    <Row margin="22px 0 0 0">
      {dashboardIsLoading ? (
        <Skeleton width={'100%'} height={'130px'} />
      ) : (
        <Table
          header={[
            { key: 'rowLegend', value: '' },
            { key: 'snx', value: 'snx' },
            { key: 'sUSD', value: 'susd' },
            { key: 'eth', value: 'eth' },
            { key: 'synths', value: t('dashboard.table.synths') },
            { key: 'debt', value: t('dashboard.table.debt') },
          ]}
          data={data}
        />
      )}
    </Row>
  );
};

const Dashboard = ({ t }) => {
  const theme = useContext(ThemeContext);
  const {
    state: {
      wallet: { currentWallet },
      ui: { dashboardIsLoading },
      transactions: { successQueue },
    },
  } = useContext(Store);

  const {
    balances = {},
    prices = {},
    rewardData = {},
    debtData = {},
    synthData = {},
  } = useFetchData(currentWallet, successQueue);

  return (
    <DashboardWrapper>
      <Header currentWallet={currentWallet} />
      <Content>
        <Container>
          <ContainerHeader>
            <H5>{t('dashboard.sections.prices')}</H5>
          </ContainerHeader>
          <Balances state={{ balances, prices, theme, dashboardIsLoading }} />
        </Container>
        <Container curved={true}>
          <RewardInfo state={{ rewardData, theme, dashboardIsLoading }} />
        </Container>
        <Container>
          <ContainerHeader>
            <H5>{t('dashboard.sections.wallet')}</H5>
            <DataHeaderLarge
              margin="0px 0px 22px 0px"
              color={theme.colorStyles.body}
            />
          </ContainerHeader>
          <CollRatios state={{ debtData, dashboardIsLoading }} />
          <Pie state={{ balances, debtData, theme, dashboardIsLoading }} />
          <BalanceTable
            state={{
              balances,
              synthData,
              debtData,
              prices,
              dashboardIsLoading,
            }}
          />
          <Row margin="18px 0 0 0 ">
            <Link href="https://synthetix.exchange" target="_blank">
              <ButtonTertiaryLabel>
                {t('dashboard.buttons.exchange')}
              </ButtonTertiaryLabel>
            </Link>
            <Link>
              <ButtonTertiaryLabel>
                {t('dashboard.buttons.synths')}
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
  padding: 0 15px
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

export default withTranslation()(Dashboard);
