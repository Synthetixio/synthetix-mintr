import React, { useEffect, useState, Fragment } from 'react';
import styled from 'styled-components';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { formatCurrency } from '../../../helpers/formatters';

import {
  PageTitle,
  PLarge,
  H2,
  H5,
  TableDataMedium,
  TableHeaderMedium,
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

const initialScenario = null;

const renderHiddenContent = () => {
  const data = [
    {
      amount: '2,000.00',
      remaining: '500.00',
      date: '14:00 | 4 Oct 2019',
    },
    {
      amount: '2,000.00',
      remaining: '500.00',
      date: '14:00 | 4 Oct 2019',
    },
    {
      amount: '2,000.00',
      remaining: '500.00',
      date: '14:00 | 4 Oct 2019',
    },
  ];
  return (
    <HiddenContent>
      <HeaderRow>
        {['Type', 'Amount', 'Rate', 'Date | Time', 'View'].map(
          headerElement => {
            return (
              <HeaderCell key={headerElement}>
                <TableHeaderMedium>{headerElement}</TableHeaderMedium>
              </HeaderCell>
            );
          }
        )}
      </HeaderRow>
      <table style={{ width: '100%' }}>
        <tbody>
          {data.map((dataElement, i) => {
            return (
              <tr key={i}>
                <td>
                  <TypeImage src="/images/actions/deposit.svg" />
                  <TableDataMedium>Deposit</TableDataMedium>
                </td>
                <td>
                  <TableDataMedium>{dataElement.amount} sUSD</TableDataMedium>
                </td>
                <td>
                  <TableDataMedium>{dataElement.rate} sUSD</TableDataMedium>
                </td>
                <td>
                  <TableDataMedium>{dataElement.date}</TableDataMedium>
                </td>
                <td>VIEW</td>
              </tr>
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
      remaining: '500.00',
      date: '14:00 | 4 Oct 2019',
    },
    {
      amount: '2,000.00',
      remaining: '500.00',
      date: '14:00 | 4 Oct 2019',
    },
    {
      amount: '2,000.00',
      remaining: '500.00',
      date: '14:00 | 4 Oct 2019',
    },
  ];
  const [expandedElements, setExpanded] = useState([]);
  return (
    <Fragment>
      <Activity>
        <ActivityHeader>
          <H5 marginTop="10px">Recent Activity:</H5>
          <MoreButtons>
            <ButtonTertiary>View More</ButtonTertiary>
            <ButtonTertiary>View Contract</ButtonTertiary>
          </MoreButtons>
        </ActivityHeader>
        <List>
          <HeaderRow>
            {['Type', 'Amount', 'Remaining', 'Date | Time', 'Details'].map(
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
                    <TypeImage src="/images/actions/deposit.svg" />
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

const useGetDepotData = () => {
  const [data, setData] = useState({});
  useEffect(() => {
    const getDepotData = async () => {
      try {
        const [totalSellableDeposits] = await Promise.all([
          snxJSConnector.snxJS.Depot.totalSellableDeposits(),
        ]);
        setData({
          totalSellableDeposits: bigNumberFormatter(totalSellableDeposits),
        });
      } catch (e) {
        console.log(e);
      }
    };
    getDepotData();
  }, []);
  return data;
};

const Depot = () => {
  const [currentScenario, setCurrentScenario] = useState(initialScenario);
  const { totalSellableDeposits } = useGetDepotData();

  return (
    <PageContainer>
      <DepotAction
        action={currentScenario}
        onDestroy={() => setCurrentScenario(null)}
      />
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
                <Amount>4,000.00 sUSD</Amount>
              </ButtonContainer>
            </Button>
          );
        })}
      </ButtonRow>
      <ExpandableTable></ExpandableTable>
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
  margin-right: 10px;
`;

const HiddenContent = styled.div`
  padding: 25px;
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-top-width: 0;
`;

export default Depot;
