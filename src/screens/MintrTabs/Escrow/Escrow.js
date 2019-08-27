/* eslint-disable */
import React, { useState, useEffect, useContext } from 'react';
import snxJSConnector from '../../../helpers/snxJSConnector';

import { Store } from '../../../store';

import PageContainer from '../../../components/PageContainer';
import { PageTitle, PLarge } from '../../../components/Typography';

const bigNumberFormatter = value =>
  Number(snxJSConnector.utils.formatEther(value));

const useGetVestingData = walletAddress => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const getVestingData = async () => {
      try {
        let schedule = [];
        let total = 0;
        const result = await snxJSConnector.snxJS.RewardEscrow.checkAccountSchedule(
          walletAddress
        );
        for (let i = 0; i < result.length; i += 2) {
          const quantity = bigNumberFormatter(result[i + 1]);
          total += Number(quantity);
          if (!result[i].isZero() && quantity) {
            schedule.push({
              date: new Date(Number(result[i]) * 1000),
              quantity,
            });
          }
        }
        setData({ schedule, total });
      } catch (e) {
        console.log(e);
      }
    };
    getVestingData();
  }, [walletAddress]);
  return data;
};

const Table = () => {
  const {
    state: {
      wallet: { currentWallet },
    },
  } = useContext(Store);
  const vestingData = useGetVestingData(currentWallet);
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Vesting Date</th>
            <th>SNX Quantity</th>
          </tr>
        </thead>
        <tbody>
          {vestingData && vestingData.schedule
            ? vestingData.schedule.map(row => {
                return (
                  <tr>
                    <td>{row.date.toISOString()}</td>
                    <td>{row.quantity}</td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>
      <div>{vestingData && vestingData.total}</div>
    </div>
  );
};

const Escrow = () => {
  return (
    <PageContainer>
      <PageTitle>Vest your SNX staking rewards in escrow</PageTitle>
      <PLarge>
        If you have locked your SNX and minted sUSD, you are eligible to receive
        SNX staking rewards, which you can vest here. All SNX staking rewards
        are escrowed for 12 months.
      </PLarge>
      <Table />
    </PageContainer>
  );
};

export default Escrow;
