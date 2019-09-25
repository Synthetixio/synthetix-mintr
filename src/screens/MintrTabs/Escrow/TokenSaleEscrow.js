/* eslint-disable */
import React, { Fragment, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { withTranslation, useTranslation } from 'react-i18next';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { Store } from '../../../store';
import { formatCurrency } from '../../../helpers/formatters';

import {
  TableHeader,
  TableWrapper,
  Table,
  TBody,
  TR,
  TD,
} from '../../../components/ScheduleTable';
import {
  PageTitle,
  PLarge,
  H5,
  DataLarge,
  TableHeaderMedium,
  DataHeaderLarge,
  DataMega,
} from '../../../components/Typography';

const formatBigNumber = value =>
  Number(snxJSConnector.utils.formatEther(value));

const mapVestingData = data => {
  const currentUnixTime = new Date().getTime();
  const vestStartTime = 1520899200;
  const monthInSeconds = 2592000;
  const dataReversed = data.slice().reverse();
  let totalPeriod = 0;
  let hasVesting = false;
  let lastVestTime;
  let groupedData = [];
  let availableTokensForVesting = false;
  let totalVesting;

  for (let i = 0; i < dataReversed.length - 1; i += 2) {
    const parsedQuantity = formatBigNumber(dataReversed[i], 3);
    const parsedDate = parseInt(dataReversed[i + 1]) * 1000;
    if (parsedDate !== 0) {
      hasVesting = true;
      totalPeriod++;
    }

    if (parsedDate === 0 && hasVesting) {
      totalPeriod++;
    }

    if (parsedDate !== 0 && !lastVestTime) {
      lastVestTime = dataReversed[i + 1];
    }

    if (parsedDate > 0 && parsedDate < currentUnixTime) {
      availableTokensForVesting = true;
    }

    if (lastVestTime) {
      totalVesting = totalVesting
        ? totalVesting.add(dataReversed[i])
        : dataReversed[i];
      groupedData.push({ time: parsedDate, value: parsedQuantity });
    }
  }

  const escrowPeriod = parseInt(
    (lastVestTime - vestStartTime) / monthInSeconds
  );
  const releaseIntervalMonths = escrowPeriod / totalPeriod;
  return hasVesting
    ? {
        escrowPeriod,
        releaseIntervalMonths,
        totalPeriod,
        availableTokensForVesting,
        data: groupedData,
        totalVesting: formatBigNumber(totalVesting),
      }
    : null;
};

const useGetVestingData = walletAddress => {
  const [data, setData] = useState({});
  useEffect(() => {
    const getVestingData = async () => {
      try {
        let schedule = [];
        let total = 0;
        const result = await snxJSConnector.snxJS.EscrowChecker.checkAccountSchedule(
          walletAddress
        );
        console.log(result);
        if (result) {
          const vestingData = mapVestingData(result);
        }
        setData(vestingData);
      } catch (e) {
        console.log(e);
      }
    };
    getVestingData();
  }, [walletAddress]);
  return data;
};

const VestingInfo = ({ state }) => {
  const { t } = useTranslation();
  const { escrowPeriod, releaseIntervalMonths, totalPeriod } = state;
  return (
    <ScheduleWrapper>
      <H5>{t('escrow.tokenSale.table.title')}</H5>
      <TableHeader>
        <TableHeaderMedium>
          {t('escrow.tokenSale.table.period')}
        </TableHeaderMedium>
        <TableHeaderMedium>
          {t('escrow.tokenSale.table.interval')}
        </TableHeaderMedium>
        <TableHeaderMedium>
          {t('escrow.tokenSale.table.number')}
        </TableHeaderMedium>
      </TableHeader>
      <TableWrapper style={{ height: 'auto' }}>
        <Table cellSpacing='0'>
          <TBody>
            <TR>
              <TD>
                <DataLarge>
                  {escrowPeriod} {t('escrow.tokenSale.table.months')}
                </DataLarge>
              </TD>
              <TD>
                <DataLarge>
                  {releaseIntervalMonths} {t('escrow.tokenSale.table.months')}
                </DataLarge>
              </TD>
              <TD>
                <DataLarge>{totalPeriod}</DataLarge>
              </TD>
            </TR>
          </TBody>
        </Table>
      </TableWrapper>
    </ScheduleWrapper>
  );
};

const VestingSchedule = ({ state }) => {
  const { t } = useTranslation();
  const { data, totalVesting } = state;
  const tableContent = data
    ? data.map((period, i) => {
        if (period.time === 0) {
          return (
            <TR key={`${i}-${new Date().getTime()}`}>
              <TD>
                <DataLarge>-</DataLarge>
              </TD>
              <TD>
                <DataLarge>{t('escrow.tokenSale.table.vested')}</DataLarge>
              </TD>
            </TR>
          );
        } else {
          return (
            <TR key={`${i}-${new Date().getTime()}`}>
              <TD>
                <DataLarge>{format(period.time, 'dd MMMM yyyy')}</DataLarge>
              </TD>
              <TD>
                <DataLarge>{formatCurrency(period.value)}</DataLarge>
              </TD>
            </TR>
          );
        }
      })
    : null;
  return (
    <ScheduleWrapper>
      <H5>{t('escrow.tokenSale.table.title')}</H5>
      <TableHeader>
        <TableHeaderMedium>
          {t('escrow.tokenSale.table.date')}
        </TableHeaderMedium>
        <TableHeaderMedium>
          SNX {t('escrow.tokenSale.table.quantity')}
        </TableHeaderMedium>
      </TableHeader>
      <TableWrapper>
        <Table cellSpacing='0'>
          <TBody>{tableContent}</TBody>
        </Table>
      </TableWrapper>
      <RightBlock>
        <DataBlock>
          <DataHeaderLarge style={{ textTransform: 'uppercase' }}>
            {t('escrow.tokenSale.total')}
          </DataHeaderLarge>
          <DataMegaEscrow>
            {totalVesting ? formatCurrency(totalVesting) : '--'} SNX
          </DataMegaEscrow>
        </DataBlock>
      </RightBlock>
    </ScheduleWrapper>
  );
};

const TokenSaleEscrow = ({ t }) => {
  const {
    state: {
      wallet: { currentWallet },
    },
  } = useContext(Store);
  const {
    escrowPeriod,
    releaseIntervalMonths,
    totalPeriod,
    availableTokensForVesting,
    data,
    totalVesting,
  } = useGetVestingData(currentWallet);
  return (
    <Fragment>
      <PageTitle>{t('escrow.tokenSale.pageTitle')}</PageTitle>
      <PLarge>{t('escrow.tokenSale.pageSubtitle')}</PLarge>
      <VestingInfo
        state={{ escrowPeriod, releaseIntervalMonths, totalPeriod }}
      />
      <VestingSchedule state={{ data, totalVesting }} />
    </Fragment>
  );
};

const ScheduleWrapper = styled.div`
  width: 100%;
  margin: 50px 0;
`;

const RightBlock = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const DataBlock = styled.div`
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-radius: 2px;
  width: 338px;
  height: 88px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
`;

const DataMegaEscrow = styled(DataMega)`
  color: ${props => props.theme.colorStyles.escrowNumberBig};
`;

export default withTranslation()(TokenSaleEscrow);
