import { useState, useEffect, useContext } from 'react';
import { addSeconds } from 'date-fns';
import snxJSConnector from '../../helpers/snxJSConnector';

import { Store } from '../../store';

import { bytesFormatter } from '../../helpers/formatters';
import { toggleDashboardIsLoading } from '../../ducks/ui';

const bigNumberFormatter = value =>
  Number(snxJSConnector.utils.formatEther(value));

const getBalances = async walletAddress => {
  try {
    const result = await Promise.all([
      snxJSConnector.snxJS.Synthetix.collateral(walletAddress),
      snxJSConnector.snxJS.sUSD.balanceOf(walletAddress),
      snxJSConnector.provider.getBalance(walletAddress),
    ]);
    const [snx, sUSD, eth] = result.map(bigNumberFormatter);
    return { snx, sUSD, eth };
  } catch (e) {
    console.log(e);
  }
};

const getPrices = async () => {
  try {
    const result = await snxJSConnector.snxJS.ExchangeRates.ratesForCurrencies(
      ['SNX', 'sUSD', 'ETH'].map(bytesFormatter)
    );
    const [snx, sUSD, eth] = result.map(bigNumberFormatter);
    return { snx, sUSD, eth };
  } catch (e) {
    console.log(e);
  }
};

const getRewards = async walletAddress => {
  try {
    const [
      feesAreClaimable,
      currentFeePeriod,
      feePeriodDuration,
    ] = await Promise.all([
      snxJSConnector.snxJS.FeePool.feesClaimable(walletAddress),
      snxJSConnector.snxJS.FeePool.recentFeePeriods(0),
      snxJSConnector.snxJS.FeePool.feePeriodDuration(),
    ]);

    const currentPeriodStart =
      currentFeePeriod && currentFeePeriod.startTime
        ? new Date(parseInt(currentFeePeriod.startTime * 1000))
        : null;
    const currentPeriodEnd =
      currentPeriodStart && feePeriodDuration
        ? addSeconds(currentPeriodStart, feePeriodDuration)
        : null;
    return { feesAreClaimable, currentPeriodEnd };
  } catch (e) {
    console.log(e);
  }
};

const getDebt = async walletAddress => {
  try {
    const result = await Promise.all([
      snxJSConnector.snxJS.SynthetixState.issuanceRatio(),
      snxJSConnector.snxJS.Synthetix.collateralisationRatio(walletAddress),
      snxJSConnector.snxJS.Synthetix.transferableSynthetix(walletAddress),
      snxJSConnector.snxJS.Synthetix.debtBalanceOf(
        walletAddress,
        bytesFormatter('sUSD')
      ),
    ]);
    const [targetCRatio, currentCRatio, transferable, debtBalance] = result.map(
      bigNumberFormatter
    );
    return {
      targetCRatio,
      currentCRatio,
      transferable,
      debtBalance,
    };
  } catch (e) {
    console.log(e);
  }
};

const getEscrow = async walletAddress => {
  try {
    const results = await Promise.all([
      snxJSConnector.snxJS.RewardEscrow.totalEscrowedAccountBalance(
        walletAddress
      ),
      snxJSConnector.snxJS.SynthetixEscrow.balanceOf(walletAddress),
    ]);
    const [reward, tokenSale] = results.map(bigNumberFormatter);
    return {
      reward,
      tokenSale,
    };
  } catch (e) {
    console.log(e);
  }
};

const getSynths = async walletAddress => {
  try {
    const synths = snxJSConnector.synths
      .filter(({ asset }) => asset)
      .map(({ name }) => name);
    const result = await Promise.all(
      synths.map(synth => snxJSConnector.snxJS[synth].balanceOf(walletAddress))
    );
    const balances = await Promise.all(
      result.map((balance, i) => {
        return snxJSConnector.snxJS.Synthetix.effectiveValue(
          bytesFormatter(synths[i]),
          balance,
          bytesFormatter('sUSD')
        );
      })
    );
    let totalBalance = 0;
    const formattedBalances = balances.map((balance, i) => {
      const formattedBalance = bigNumberFormatter(balance);
      totalBalance += formattedBalance;
      return {
        synth: synths[i],
        balance: formattedBalance,
      };
    });
    return {
      balances: formattedBalances,
      total: totalBalance,
    };
  } catch (e) {
    console.log(e);
  }
};

export const useFetchData = (walletAddress, successQueue) => {
  const [data, setData] = useState({});
  const { dispatch } = useContext(Store);
  useEffect(() => {
    try {
      toggleDashboardIsLoading(true, dispatch);
      const fetchData = async () => {
        const [
          balances,
          prices,
          rewardData,
          debtData,
          escrowData,
          synthData,
        ] = await Promise.all([
          getBalances(walletAddress),
          getPrices(),
          getRewards(walletAddress),
          getDebt(walletAddress),
          getEscrow(walletAddress),
          getSynths(walletAddress),
        ]);
        setData({
          balances,
          prices,
          rewardData,
          debtData,
          escrowData,
          synthData,
        });
        toggleDashboardIsLoading(false, dispatch);
      };
      fetchData();
    } catch (e) {
      console.log(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, successQueue.length]);
  return data;
};
