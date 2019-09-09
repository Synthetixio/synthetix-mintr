/* eslint-disable */
import React, { Fragment, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

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

import PageContainer from '../../../components/PageContainer';
import Paginator from '../../../components/Paginator';
import { ButtonTertiary } from '../../../components/Button';

const TransactionsTable = () => {
  const data = [
    {
      type: 'Minted',
      amount: '1,000.00 sUSD',
      details: 'Locked SNX',
      date: '14:00 | 12 Oct `19',
    },
    {
      type: 'Burned',
      amount: '2,000.00 SNX',
      details: 'Unlocked SNX',
      date: '08:00 | 4 Oct `19',
    },
    {
      type: 'Claimed',
      amount: '500.00 SNX',
      details: 'Claimed fees',
      date: '19:00 | 2 Oct `19',
    },
    {
      type: 'Minted',
      amount: '1,000.00 sUSD',
      details: 'Locked SNX',
      date: '14:00 | 12 Oct `19',
    },
    {
      type: 'Burned',
      amount: '2,000.00 SNX',
      details: 'Unlocked SNX',
      date: '08:00 | 4 Oct `19',
    },
    {
      type: 'Claimed',
      amount: '500.00 SNX',
      details: 'Claimed fees',
      date: '19:00 | 2 Oct `19',
    },
    {
      type: 'Minted',
      amount: '1,000.00 sUSD',
      details: 'Locked SNX',
      date: '14:00 | 12 Oct `19',
    },
    {
      type: 'Burned',
      amount: '2,000.00 SNX',
      details: 'Unlocked SNX',
      date: '08:00 | 4 Oct `19',
    },
    {
      type: 'Claimed',
      amount: '500.00 SNX',
      details: 'Claimed fees',
      date: '19:00 | 2 Oct `19',
    },
    {
      type: 'Burned',
      amount: '2,000.00 SNX',
      details: 'Unlocked SNX',
      date: '08:00 | 4 Oct `19',
    },
  ];
  return (
    <TransactionsWrapper>
      <TableHeader>
        {['Type', 'Amount', 'Details', 'Date | Time', 'View'].map(
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
            {data.map((dataElement, i) => {
              return (
                <TR key={i}>
                  <TD style={{ display: 'flex' }}>
                    <TypeImage src='/images/actions/tiny-deposit.svg' />
                    <DataLarge>{dataElement.type}</DataLarge>
                  </TD>
                  <TD>
                    <DataLarge>{dataElement.amount}</DataLarge>
                  </TD>
                  <TD>
                    <DataLarge>{dataElement.details}</DataLarge>
                  </TD>
                  <TD style={{ textAlign: 'right' }}>
                    <DataLarge>{dataElement.date}</DataLarge>
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
          <TransactionsTable />
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
  padding: 32px 24px;
  background-color: ${props => props.theme.colorStyles.panels};
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-radius: 2px;
  box-shadow: 0px 2px 10px 2px ${props => props.theme.colorStyles.shadow1};
`;

const TransactionsWrapper = styled.div`
  height: auto;
  width: auto;
`;

const TypeImage = styled.img`
  width: 24px;
  height: 24px;
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
  padding: 0 20px;
`;

export default Transactions;
