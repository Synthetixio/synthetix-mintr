import React, { Fragment, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { withTranslation, useTranslation } from 'react-i18next';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { Store } from '../../../store';
import {
  formatCurrency,
  bigNumberFormatter,
} from '../../../helpers/formatters';

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
import { ButtonPrimary, ButtonSecondary } from '../../../components/Button';

import { updateGasLimit, fetchingGasLimit } from '../../../ducks/network';
import ErrorMessage from '../../../components/ErrorMessage';
import EscrowActions from '../../EscrowActions';
import TransactionPriceIndicator from '../../../components/TransactionPriceIndicator';

const useGetGasEstimateError = () => {
  const { dispatch } = useContext(Store);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getGasEstimate = async () => {
      setError(null);
      fetchingGasLimit(dispatch);
      let gasEstimate;
      try {
        gasEstimate = await snxJSConnector.snxJS.RewardEscrow.contract.estimate.vest();
      } catch (e) {
        console.log(e);
        const errorMessage =
          (e && e.message) || 'Error while getting gas estimate';
        setError(errorMessage);
      }
      updateGasLimit(Number(gasEstimate), dispatch);
    };
    getGasEstimate();
  }, []);
  return error;
};

const useGetVestingData = walletAddress => {
  const [data, setData] = useState({});
  useEffect(() => {
    const getVestingData = async () => {
      try {
        let schedule = [];
        let total = 0;
        let canVest = false;
        const currentUnixTime = new Date().getTime();
        setData({ loading: true });
        const result = await snxJSConnector.snxJS.RewardEscrow.checkAccountSchedule(
          walletAddress
        );
        for (let i = 0; i < result.length; i += 2) {
          const quantity = Number(bigNumberFormatter(result[i + 1]));
          total += Number(quantity);
          if (!result[i].isZero() && quantity) {
            if (result[i] * 1000 < currentUnixTime) {
              canVest = true;
            }
            schedule.push({
              date: new Date(Number(result[i]) * 1000),
              quantity,
            });
          }
        }
        setData({ schedule, total, loading: false, canVest });
      } catch (e) {
        console.log(e);
        setData({ loading: false });
      }
    };
    getVestingData();
  }, [walletAddress]);
  return data;
};

const VestingTable = ({ data }) => {
  const { t } = useTranslation();
  if (data.loading) {
    return (
      <TablePlaceholder>
        <Spinner />
      </TablePlaceholder>
    );
  }

  if (!data.total || data.total.length === 0) {
    return (
      <TablePlaceholder>
        <PLarge>{t('escrow.staking.table.none')}</PLarge>
      </TablePlaceholder>
    );
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
            {data && data.schedule
              ? data.schedule.map((row, i) => {
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
            {data && data.total ? formatCurrency(data.total) : '--'} SNX
          </DataMegaEscrow>
        </DataBlock>
      </RightBlock>
    </ScheduleWrapper>
  );
};

const RewardEscrow = ({ t, onPageChange }) => {
  const [currentScenario, setCurrentScenario] = useState(null);
  const {
    state: {
      wallet: { currentWallet },
    },
  } = useContext(Store);
  const vestingData = useGetVestingData(currentWallet);
  const hasNoVestingSchedule =
    !vestingData.total || vestingData.total.length === 0;
  const gasEstimateError = useGetGasEstimateError();

  return (
    <Fragment>
      <EscrowActions
        action={currentScenario}
        onDestroy={() => setCurrentScenario(null)}
        vestAmount={!hasNoVestingSchedule ? vestingData.total : 0}
      />

      <PageTitle>{t('escrow.staking.pageTitle')}</PageTitle>
      <PLarge>{t('escrow.staking.pageSubtitle')}</PLarge>
      <VestingTable data={vestingData} />
      {!hasNoVestingSchedule ? <TransactionPriceIndicator /> : null}
      <ErrorMessage message={gasEstimateError} />
      <ButtonRow>
        <ButtonSecondary
          width="48%"
          onClick={() => onPageChange('tokenSaleVesting')}
        >
          VIEW TOKEN SALE ESCROW
        </ButtonSecondary>
        <ButtonPrimary
          disabled={
            hasNoVestingSchedule || gasEstimateError || !vestingData.canVest
          }
          onClick={() => setCurrentScenario('rewardsVesting')}
          width="48%"
        >
          {t('escrow.buttons.vest')}
        </ButtonPrimary>
      </ButtonRow>
    </Fragment>
  );
};

const ScheduleWrapper = styled.div`
  width: 100%;
  margin-top: 50px;
`;

const RightBlock = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const TablePlaceholder = styled.div`
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

const ButtonRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

export default withTranslation()(RewardEscrow);
