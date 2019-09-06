import { useState, useEffect } from 'react';
import { addSeconds } from 'date-fns';
import snxJSConnector from '../../helpers/snxJSConnector';
import { bytesFormatter } from '../../helpers/formatters';

const bigNumberFormatter = value =>
  Number(snxJSConnector.utils.formatEther(value));

export const useGetBalances = walletAddress => {
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchBalances = async () => {
      const result = await Promise.all([
        snxJSConnector.snxJS.Synthetix.collateral(walletAddress),
        snxJSConnector.snxJS.sUSD.balanceOf(walletAddress),
        snxJSConnector.provider.getBalance(walletAddress),
      ]);
      const [snx, sUSD, eth] = result.map(bigNumberFormatter);
      setData({ snx, sUSD, eth });
    };
    fetchBalances();
  }, [walletAddress]);
  return data;
};

export const useGetPrices = () => {
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchPrices = async () => {
      const SNXBytes = bytesFormatter('SNX');
      const sUSDBytes = bytesFormatter('sUSD');
      const ETHBytes = bytesFormatter('ETH');
      const result = await snxJSConnector.snxJS.ExchangeRates.ratesForCurrencies(
        [SNXBytes, sUSDBytes, ETHBytes]
      );
      const [snx, sUSD, eth] = result.map(bigNumberFormatter);
      setData({ snx, sUSD, eth });
    };
    fetchPrices();
  }, []);
  return data;
};

export const useGetRewardData = walletAddress => {
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchRewards = async () => {
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
      setData({ feesAreClaimable, currentPeriodEnd });
    };
    fetchRewards();
  }, [walletAddress]);
  return data;
};

export const useGetDebtData = walletAddress => {
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchCRatios = async () => {
      const sUSDBytes = bytesFormatter('sUSD');
      const result = await Promise.all([
        snxJSConnector.snxJS.SynthetixState.issuanceRatio(),
        snxJSConnector.snxJS.Synthetix.collateralisationRatio(walletAddress),
        snxJSConnector.snxJS.Synthetix.transferableSynthetix(walletAddress),
        snxJSConnector.snxJS.Synthetix.debtBalanceOf(walletAddress, sUSDBytes),
      ]);
      const [
        targetCRatio,
        currentCRatio,
        transferable,
        debtBalance,
      ] = result.map(bigNumberFormatter);
      setData({
        targetCRatio,
        currentCRatio,
        transferable,
        debtBalance,
      });
    };
    fetchCRatios();
  }, [walletAddress]);
  return data;
};

export const useGetSynthData = walletAddress => {
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchSynthBalances = async () => {
      const synths = snxJSConnector.synths
        .filter(({ asset }) => asset)
        .map(({ name }) => name);
      const result = await Promise.all(
        synths.map(synth =>
          snxJSConnector.snxJS[synth].balanceOf(walletAddress)
        )
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

      setData({
        balances: formattedBalances,
        total: totalBalance,
      });
    };
    fetchSynthBalances();
  }, [walletAddress]);
  return data;
};
