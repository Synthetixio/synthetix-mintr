import React from 'react';
import styled from 'styled-components';
import Header from '../../components/header';
import PieChart from '../../components/pie-chart';
import Table from '../../components/table';
import { ChartData, H5, Figure } from '../../components/typography';


const renderBalances = () => {
  return (
    <BalanceRow>
      <BalanceItem>
        <CurrencyIcon src="/images/snx-icon.svg" />
        <Balance>
          <div><ChartData>0.89 SNX</ChartData></div>
          <div><ChartData>$1.00 USD</ChartData></div>
        </Balance>
      </BalanceItem>
      <BalanceItem>
        <CurrencyIcon src="/images/snx-icon.svg" />
        <Balance>
          <div><ChartData>0.89 SNX</ChartData></div>
          <div><ChartData>$1.00 USD</ChartData></div>
        </Balance>
      </BalanceItem>
      <BalanceItem>
        <CurrencyIcon src="/images/eth-icon.svg" />
        <Balance>
          <div><ChartData>0.89 SNX</ChartData></div>
          <div><ChartData>$1.00 USD</ChartData></div>
        </Balance>
      </BalanceItem>
    </BalanceRow>
  );
};

const renderCollRatios = () => {
  return (
    <Row margin="0 0 22px 0">
      <Box>
        <Figure>450%</Figure>
        <CollRatioCaption>Current collateralization ratio</CollRatioCaption>
      </Box>
      <Box>
        <Figure>500%</Figure>
        <CollRatioCaption>Target collateralization ratio</CollRatioCaption>
      </Box>
    </Row>
  );
};

const renderPieChart = () => {
  return (
    <Box full={true}>
      <Row padding="18px">
        <PieChart data={[]} />
        <PieChartLegend>
          <PieChartHeading>Your SNX holdings:</PieChartHeading>
          <LegendRow color="#E8E7FD">
            <ChartData>10,000.00 SNX</ChartData>
            <LegendDescription>Staking</LegendDescription>
          </LegendRow>

          <LegendRow color="#F3F3F3">
            <ChartData>5,000.00 SNX</ChartData>
            <LegendDescription>Transferable</LegendDescription>
          </LegendRow>
        </PieChartLegend>
      </Row>
    </Box>
  );
};

const renderTable = () => {
  return (
    <Row margin="22px 0 0 0">
      <Table
        header={[
          { key: 'rowLegend', value: '' },
          { key: 'snx', value: 'snx' },
          { key: 'sUSD', value: 'susd' },
          { key: 'eth', value: 'eth' },
          { key: 'synths', value: 'synths' },
          { key: 'debt', value: 'debt' },
        ]}
        data={[
          {
            rowLegend: 'balance',
            snx: '10,000.00',
            sUSD: '1,500.00',
            eth: '0.10',
            synths: '0.24 sUSD',
            debt: '0.29 sUSD',
          },
          {
            rowLegend: '$ USD',
            snx: '1,000.00',
            sUSD: '1,500.00',
            eth: '0.10',
            synths: '0.24 sUSD',
            debt: '0.29 sUSD',
          },
        ]}
      />
    </Row>
  );
};

const Dashboard = () => {
  return (
    <DashboardWrapper>
      <Header />
      <Content>
        <Container>
          <ContainerHeader>
            <H5>Current Prices:</H5>
          </ContainerHeader>
          {renderBalances()}
        </Container>
        <Container curved={true}>
          <Row>
            <ChartData>
              <Highlighted>2 days</Highlighted> left to claim rewards
            </ChartData>
            <InfoIcon src="/images/info-icon.svg" />
          </Row>
        </Container>
        <Container>
          <ContainerHeader>
            <H5>Wallet Details:</H5>
            <ChartData margin="0px 0px 32px 0px">User ID: #100,000,000</ChartData>
          </ContainerHeader>
          {renderCollRatios()}
          {renderPieChart()}
          {renderTable()}
          <Row margin="18px 0 0 0 ">
            <Button>Go to synthetix.exchange</Button>
            <Button>View Synths balance</Button>
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
  transition: all ease-out 0.5s;
  flex-shrink: 0;
  border-right: 1px solid ${props => props.theme.colorStyles.borders};
`;

const Content = styled('div')`
  padding: 0 32px;
`;

const Container = styled.div`
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-radius: ${props => (props.curved ? '40px' : '5px')};
  padding: ${props => (props.curved ? '10px' : '32px')};
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

const Rewards = styled.div`
  font-family: 'apercu-medium';
`;

const Highlighted = styled.span`
  font-family: 'apercu-bold';
  color: ${props => props.theme.colorStyles.hyperlink};
`;

const InfoIcon = styled.img`
  width: 24px;
  height: 24px;
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

const Button = styled.button`
  width: 240px;
  border-radius: 5px;
  text-transform: uppercase;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6f6e98;
  background-color: ${props => props.theme.colorStyles.buttonTertiary};
  font-family: 'apercu-medium';
  font-size: 14px;
  border: 1px solid ${props => props.theme.colorStyles.borders};
`;

const CollRatioCaption = styled.div`
  font-family: 'apercu-medium';
  font-size: 14px;
  color: ${props => props.theme.colorStyles.heading};
`;

const PieChartLegend = styled.div`
  flex: 1;
  margin-left: 18px;
`;

const PieChartHeading = styled.div`
  font-family: 'apercu-bold';
  font-size: 14px;
  text-transform: uppercase;
  color: ${props => props.theme.colorStyles.body};
`;

const LegendRow = styled.div`
  background-color: ${props => props.theme.colorStyles.accentDark};
  margin-top: 16px;
  padding: 14px;
  display: flex;
  align-items: center;
  border-radius: 2px;
  justify-content: space-between;
`;

const LegendValue = styled.div`
  font-family: 'apercu-bold';
  font-size: 14px;
  color: #28275a;
`;

const LegendDescription = styled.div`
  font-size: 10px;
  font-family: 'apercu-bold';
  text-transform: uppercase;
`;

export default Dashboard;
