import React, { Fragment, useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { formatCurrency } from '../../../helpers/formatters';

import {
  TableHeader,
  TableWrapper,
  Table,
  TBody,
  TR,
} from '../../../components/ScheduleTable';

import {
  DataLarge,
  TableHeaderMedium,
  HyperlinkSmall,
  ButtonTertiaryLabel,
} from '../../../components/Typography';

import { Store } from '../../../store';

import PageContainer from '../../../components/PageContainer';
import Paginator from '../../../components/Paginator';
import { ButtonTertiary } from '../../../components/Button';

const stringifyQuery = query => {
  return (query = Object.keys(query).reduce((acc, next, index) => {
    if (index > 0) {
      acc += '&';
    }
    acc += `${next}=${query[next]}`;
    return acc;
  }, '?'));
};

const getApiUrl = networkName =>
  `https://${
    networkName === 'mainnet' ? '' : networkName + '.'
  }api.synthetix.io/api/`;

const useGetTransactions = (walletAddress, networkName) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const getTransaction = async () => {
      const query = {
        fromAddress: walletAddress,
      };

      const response = await fetch(
        `${getApiUrl(networkName)}blockchainEventsFiltered${stringifyQuery(
          query
        )}`
      );
      const transactions = await response.json();
      setData(transactions);
    };
    getTransaction();
  }, [walletAddress]);
  return data;
};

const getEventInfo = event => {
  switch (event) {
    case 'Issued':
      return {
        type: 'Minted',
        details: 'Locked SNX',
      };
    case 'Burned':
      return {
        type: 'Burned',
        details: 'Unlocked SNX',
      };
    case 'FeesClaimed':
      return {
        type: 'Claimed',
        details: 'Claimed Fees',
      };
    case 'Exchange':
      return {
        type: 'Traded',
        details: 'Exchanged Tokens',
      };
    case 'Sent':
      return {
        type: 'Sent',
        details: 'To another wallet',
      };
    case 'SynthDeposit':
      return {
        type: 'Deposited',
        details: 'To Depot',
      };
    case 'SynthWithdrawal':
      return {
        type: 'Withdrawn',
        details: 'From Depot',
      };
    default:
      return {};
  }
};

const TransactionsTable = ({ data }) => {
  return (
    <TransactionsWrapper>
      <TableHeader>
        {['Type', 'Amount', 'Details', 'Time | Date', 'View'].map(
          headerElement => {
            return (
              <TH key={headerElement}>
                <TableHeaderMedium>{headerElement}</TableHeaderMedium>
              </TH>
            );
          }
        )}
      </TableHeader>
      <TableWrapper style={{ height: 'auto' }}>
        <Table cellSpacing='0'>
          <TBody>
            {data.map((dataElement, i, event) => {
              const { type, details } = getEventInfo(dataElement.event);
              return (
                <TR key={(i, event)}>
                  <TD style={{ display: 'flex' }}>
                    <TypeImage img src='/images/images/tiny-mint.svg' />
                    <DataLarge>{type}</DataLarge>
                  </TD>
                  <TD>
                    <DataLarge>
                      {formatCurrency(dataElement.value)} {dataElement.token}
                    </DataLarge>
                  </TD>
                  <TD>
                    <DataLarge>{details}</DataLarge>
                  </TD>
                  <TD style={{ textAlign: 'right' }}>
                    <DataLarge>
                      {format(
                        new Date(dataElement.createdAt),
                        'hh:mm | d MMM yy'
                      )}
                    </DataLarge>
                  </TD>
                  <TD style={{ textAlign: 'right' }}>
                    <HyperlinkSmall>VIEW</HyperlinkSmall>
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      </TableWrapper>
    </TransactionsWrapper>
  );
};

const Transactions = () => {
  const {
    state: {
      wallet: { currentWallet, networkName },
    },
  } = useContext(Store);
  const transactions = useGetTransactions(currentWallet, networkName);
  console.log(transactions);
  return (
    <PageContainer>
      <Fragment>
        <Filters>
          <Inputs>
            <Selector>
              <ButtonTertiaryLabel>TYPE</ButtonTertiaryLabel>
              <img src='/images/caret-down.svg' />
            </Selector>
            <Selector>
              <ButtonTertiaryLabel>DATES</ButtonTertiaryLabel>
              <img src='/images/caret-down.svg' />
            </Selector>
            <Selector>
              <ButtonTertiaryLabel>AMOUNT</ButtonTertiaryLabel>
              <img src='/images/caret-down.svg' />
            </Selector>
            <ButtonTertiary>CLEAR FILTERS</ButtonTertiary>
          </Inputs>
        </Filters>
        <TransactionsPanel>
          <TransactionsTable data={transactions} />
          <Paginator />
        </TransactionsPanel>
      </Fragment>
    </PageContainer>
  );
};

const Filters = styled.div`
  width: 100%;
  height: 88px;
  padding: 24px;
  background-color: ${props => props.theme.colorStyles.panels};
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-radius: 2px;
  box-shadow: 0px 2px 10px 2px ${props => props.theme.colorStyles.shadow1};
  margin-bottom: 24px;
`;

const Selector = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 16px;
  height: 40px;
  padding: 0 16px;
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-radius: 5px;
  transition: all 0.2s ease;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.theme.colorStyles.buttonTertiaryBgFocus};
`;

const Inputs = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 90%;
`;

const TransactionsPanel = styled.div`
  width: 100%;
  height: 800px;
  padding: 32px;
  background-color: ${props => props.theme.colorStyles.panels};
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-radius: 2px;
  box-shadow: 0px 2px 10px 2px ${props => props.theme.colorStyles.shadow1};
`;

const TransactionsWrapper = styled.div`
  height: auto;
  width: 100%;
`;

const TypeImage = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 8px;
`;

//

const TH = styled.th`
  text-align: left;
  & :last-child,
  & :nth-last-child(2) {
    text-align: right;
  }
`;

const TD = styled.td`
  height: 64px;
  padding: 0px;
  align-items: center;
`;

export default Transactions;
