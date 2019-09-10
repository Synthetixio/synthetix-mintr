/* eslint-disable */
import React, { useContext, useEffect, useState, Fragment } from 'react';
import styled from 'styled-components';
import { Store } from '../../../store';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { formatCurrency } from '../../../helpers/formatters';

import {
  PageTitle,
  PLarge,
  H2,
  H5,
  TableDataMedium,
  TableHeaderMedium,
  HyperlinkSmall,
} from '../../../components/Typography';
import PageContainer from '../../../components/PageContainer';
import { ButtonTertiary } from '../../../components/Button';
import {
  List,
  HeaderRow,
  BodyRow,
  Cell,
  HeaderCell,
  ExpandableRow,
} from '../../../components/List';
import { Plus, Minus } from '../../../components/Icons';

import DepotAction from '../../DepotActions';

const bigNumberFormatter = value =>
  Number(snxJSConnector.utils.formatEther(value));

const sumBy = (collection, key) => {
  return collection.reduce((acc, curr) => {
    return acc + curr[key];
  }, 0);
};

const initialScenario = null;

const renderHiddenContent = () => {
  const data = [
    {
      amount: '2,000.00',
      remaining: '2,000.00',
      date: '14:00 | 12 Oct `19',
    },
    {
      amount: '2,000.00',
      remaining: '1,500.00',
      date: '08:00 | 4 Oct `19',
    },
    {
      amount: '1,000.00',
      remaining: '100.00',
      date: '19:00 | 2 Oct `19',
    },
  ];
  return (
    <HiddenContent>
      <table style={{ width: '100%' }}>
        <thead>
          <TRHead padding={'0 0 16px 0'}>
            {['Activity', 'Amount', 'Rate', 'Time | Date', 'View'].map(
              headerElement => {
                return (
                  <TH key={headerElement}>
                    <TableHeaderMedium>{headerElement}</TableHeaderMedium>
                  </TH>
                );
              }
            )}
          </TRHead>
        </thead>
        <tbody>
          {data.map((dataElement, i) => {
            return (
              <TRBody key={i}>
                <TD style={{ display: 'flex' }}>
                  <TypeImage src='/images/actions/tiny-sold.svg' />
                  <TableDataMedium>Sold by Depot</TableDataMedium>
                </TD>
                <TD>
                  <TableDataMedium>{dataElement.amount} sUSD</TableDataMedium>
                </TD>
                <TD>
                  <TableDataMedium>{dataElement.rate} sUSD</TableDataMedium>
                </TD>
                <TD>
                  <TableDataMedium>{dataElement.date}</TableDataMedium>
                </TD>
                <TD>
                  <HyperlinkSmall>VIEW</HyperlinkSmall>
                </TD>
              </TRBody>
            );
          })}
        </tbody>
      </table>
    </HiddenContent>
  );
};

const ExpandableTable = () => {
  const data = [
    {
      amount: '2,000.00',
      remaining: '2,000.00',
      date: '14:00 | 12 Oct `19',
    },
    {
      amount: '1,000.00',
      remaining: '100.00',
      date: '08:00 | 4 Oct `19',
    },
    {
      amount: '2,000.00',
      remaining: '1,500.00',
      date: '19:00 | 2 Oct `19',
    },
  ];
  const [expandedElements, setExpanded] = useState([]);
  return (
    <Fragment>
      <Activity>
        <ActivityHeader>
          <H5 marginTop='10px'>Recent Activity:</H5>
          <MoreButtons>
            <ButtonTertiary>View More</ButtonTertiary>
            <ButtonTertiary>View Contract</ButtonTertiary>
          </MoreButtons>
        </ActivityHeader>
        <List>
          <HeaderRow>
            {['Type', 'Amount', 'Remaining', 'Time | Date', 'Details'].map(
              headerElement => {
                return (
                  <HeaderCell key={headerElement}>
                    <TableHeaderMedium>{headerElement}</TableHeaderMedium>
                  </HeaderCell>
                );
              }
            )}
          </HeaderRow>
          {data.map((dataElement, i) => {
            const isExpanded = expandedElements.includes(i);
            return (
              <ExpandableRow key={i} expanded={isExpanded}>
                <BodyRow
                  key={i}
                  onClick={() =>
                    setExpanded(currentExpandedState => {
                      if (currentExpandedState.includes(i)) {
                        return currentExpandedState.filter(
                          state => state !== i
                        );
                      } else return [...currentExpandedState, i];
                    })
                  }
                >
                  <Cell>
                    <TypeImage src='/images/actions/tiny-deposit.svg' />
                    <TableDataMedium>Deposit</TableDataMedium>
                  </Cell>
                  <Cell>
                    <TableDataMedium>{dataElement.amount} sUSD</TableDataMedium>
                  </Cell>
                  <Cell>
                    <TableDataMedium>
                      {dataElement.remaining} sUSD
                    </TableDataMedium>
                  </Cell>
                  <Cell>
                    <TableDataMedium>{dataElement.date}</TableDataMedium>
                  </Cell>
                  <Cell>{isExpanded ? <Minus> </Minus> : <Plus />}</Cell>
                </BodyRow>
                {renderHiddenContent()}
              </ExpandableRow>
            );
          })}
        </List>
      </Activity>
    </Fragment>
  );
};

const getApiUrl = networkName =>
  `https://${
    networkName === 'mainnet' ? '' : networkName + '.'
  }api.synthetix.io/api`;

const useGetDepotEvents = (walletAddress, networkName) => {
  const [data, setData] = useState({});
  useEffect(() => {
    const getDepotEvents = async () => {
      try {
        const results = await Promise.all([
          fetch(
            `${getApiUrl(
              networkName
            )}/blockchainEventsFiltered?fromAddress=${walletAddress}&eventName=SynthDeposit`
          ),
          fetch(
            `${getApiUrl(
              networkName
            )}/blockchainEventsFiltered?toAddress=${walletAddress}&eventName=ClearedDeposit`
          ),
          fetch(
            `${getApiUrl(
              networkName
            )}/blockchainEventsFiltered?fromAddress=${walletAddress}&eventName=SynthDepositRemoved`
          ),
        ]);

        const [
          depositsMade,
          depositsCleared,
          depositsRemoved,
        ] = await Promise.all(results.map(response => response.json()));

        const totalDepositsMade = sumBy(depositsMade, 'value');
        const totalDepositsCleared = sumBy(depositsCleared, 'toAmount');
        const totalDepositsRemoved = sumBy(depositsRemoved, 'value');

        setData({
          amountAvailable: Math.max(
            0,
            totalDepositsMade - totalDepositsCleared - totalDepositsRemoved
          ),
        });
      } catch (e) {
        console.log(e);
      }
    };
    getDepotEvents();
  }, [walletAddress, networkName]);
  return data;
};
const useGetDepotData = walletAddress => {
  const [data, setData] = useState({});
  useEffect(() => {
    const getDepotData = async () => {
      try {
        const results = await Promise.all([
          snxJSConnector.snxJS.Depot.totalSellableDeposits(),
          snxJSConnector.snxJS.Depot.minimumDepositAmount(),
          snxJSConnector.snxJS.sUSD.balanceOf(walletAddress),
        ]);
        const [
          totalSellableDeposits,
          minimumDepositAmount,
          sUSDBalance,
        ] = results.map(bigNumberFormatter);
        setData({
          totalSellableDeposits,
          sUSDBalance,
        });
      } catch (e) {
        console.log(e);
      }
    };
    getDepotData();
  }, [walletAddress]);
  return data;
};

const Depot = () => {
  const [currentScenario, setCurrentScenario] = useState(initialScenario);
  const {
    state: {
      wallet: { currentWallet, networkName },
    },
  } = useContext(Store);
  const { totalSellableDeposits, sUSDBalance } = useGetDepotData(currentWallet);
  const { amountAvailable } = useGetDepotEvents(currentWallet, networkName);

  const props = {
    onDestroy: () => setCurrentScenario(null),
    sUSDBalance,
    amountAvailable,
  };

  return (
    <PageContainer>
      <DepotAction action={currentScenario} {...props} />
      <PageTitle>
        The Depot: ${formatCurrency(totalSellableDeposits)} sUSD
      </PageTitle>
      <PLarge>
        Deposit sUSD you’ve freshly minted into a queue to be sold on Uniswap,
        and you’ll receive the proceeds of all sales in ETH. While your sUSD is
        in the queue waiting to be sold, you can withdraw your sUSD back into
        your wallet at any time. Note: minimum deposit is 50 sUSD.
      </PLarge>
      <ButtonRow>
        {['deposit', 'withdraw'].map(action => {
          return (
            <Button key={action} onClick={() => setCurrentScenario(action)}>
              <ButtonContainer>
                <ActionImage src={`/images/actions/${action}.svg`} />
                <H2>{action}</H2>
                <PLarge>Amount available:</PLarge>
                <Amount>
                  $
                  {action === 'deposit'
                    ? formatCurrency(sUSDBalance)
                    : formatCurrency(amountAvailable)}{' '}
                  sUSD
                </Amount>
              </ButtonContainer>
            </Button>
          );
        })}
      </ButtonRow>
      <ExpandableTable />
    </PageContainer>
  );
};

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 32px auto 48px auto;
`;

const Button = styled.button`
  cursor: pointer;
  width: 48%;
  height: 300px;
  background-color: ${props => props.theme.colorStyles.panelButton};
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-radius: 5px;
  box-shadow: 0px 5px 10px 5px ${props => props.theme.colorStyles.shadow1};
  transition: transform ease-in 0.2s;
  &:hover {
    background-color: ${props => props.theme.colorStyles.panelButtonHover};
    box-shadow: 0px 5px 10px 8px ${props => props.theme.colorStyles.shadow1};
    transform: translateY(-2px);
  }
`;

const ButtonContainer = styled.div`
  max-width: 300px;
  margin: 0 auto;
`;

const ActionImage = styled.img`
  height: 48px;
  width: 48px;
`;

const Amount = styled.span`
  color: ${props => props.theme.colorStyles.body};
  font-family: 'apercu-medium';
  font-size: 24px;
  margin: 8px 0px 0px 0px;
`;

const Activity = styled.span`
  height: auto;
`;

const ActivityHeader = styled.span`
  height: auto;
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const MoreButtons = styled.span`
  height: auto;
  display: flex;
  & :first-child {
    margin-right: 8px;
  }
`;

const TypeImage = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 8px;
`;

const HiddenContent = styled.div`
  padding: 24px 16px;
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-top-width: 0;
`;

const TH = styled.th`
  text-transform: uppercase;
  text-align: left;
  & :last-child {
    text-align: right;
  }
`;

const TRHead = styled.tr`
  & :last-child,
  & :nth-last-child(2) {
    text-align: right;
  }
`;

const TRBody = styled.tr`
  & :last-child,
  & :nth-last-child(2) {
    text-align: right;
  }
`;

const TD = styled.td`
  text-align: left;
  align-items: center;
  & :last-child {
    text-align: right;
  }
`;

export default Depot;
