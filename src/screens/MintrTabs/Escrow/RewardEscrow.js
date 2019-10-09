import React, { Fragment, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { withTranslation, useTranslation } from 'react-i18next';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { Store } from '../../../store';
import { formatCurrency } from '../../../helpers/formatters';

import Spinner from '../../../components/Spinner';
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

const bigNumberFormatter = value =>
  Number(snxJSConnector.utils.formatEther(value));

const useGetVestingData = walletAddress => {
  const [data, setData] = useState({ loading: true });
  useEffect(() => {
    const getVestingData = async () => {
      try {
        let schedule = [];
        let total = 0;
        const result = await snxJSConnector.snxJS.RewardEscrow.checkAccountSchedule(
          walletAddress
        );
        for (let i = 0; i < result.length; i += 2) {
          const quantity = Number(bigNumberFormatter(result[i + 1]));
          total += Number(quantity);
          if (!result[i].isZero() && quantity) {
            schedule.push({
              date: new Date(Number(result[i]) * 1000),
              quantity,
            });
          }
        }
        setData({ schedule, total, loading: false });
      } catch (e) {
        console.log(e);
      }
    };
    getVestingData();
  }, [walletAddress]);
  return data;
};

const VestingTable = () => {
  const { t } = useTranslation();
  const {
    state: {
      wallet: { currentWallet },
    },
  } = useContext(Store);
  const vestingData = useGetVestingData(currentWallet);
  if (vestingData.loading) {
    return (
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    );
  }
  if (!vestingData.schedule) {
    return <div>{t('escrow.staking.table.none')}</div>;
  }
  return (
    <ScheduleWrapper>
      <H5>{t('escrow.staking.table.title')}</H5>
      <TableHeader>
        <TableHeaderMedium>{t('escrow.staking.table.date')}</TableHeaderMedium>
        <TableHeaderMedium>
          SNX {t('escrow.staking.table.quantity')}
        </TableHeaderMedium>
      </TableHeader>
      <TableWrapper>
        <Table cellSpacing="0">
          <TBody>
            {vestingData && vestingData.schedule
              ? vestingData.schedule.map((row, i) => {
                  return (
                    <TR key={i}>
                      <TD>
                        <DataLarge>
                          {format(row.date, 'dd MMMM yyyy')}
                        </DataLarge>
                      </TD>
                      <TD>
                        <DataLarge>{formatCurrency(row.quantity)}</DataLarge>
                      </TD>
                    </TR>
                  );
                })
              : null}
          </TBody>
        </Table>
      </TableWrapper>
      <RightBlock>
        <DataBlock>
          <DataHeaderLarge style={{ textTransform: 'uppercase' }}>
            {t('escrow.staking.total')}
          </DataHeaderLarge>
          <DataMegaEscrow>
            {vestingData && vestingData.total
              ? formatCurrency(vestingData.total)
              : '--'}{' '}
            SNX
          </DataMegaEscrow>
        </DataBlock>
      </RightBlock>
    </ScheduleWrapper>
  );
};

const RewardEscrow = ({ t }) => {
  return (
    <Fragment>
      <PageTitle>{t('escrow.staking.pageTitle')}</PageTitle>
      <PLarge>{t('escrow.staking.pageSubtitle')}</PLarge>
      <VestingTable />
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

const SpinnerWrapper = styled.div`
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
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

export default withTranslation()(RewardEscrow);
