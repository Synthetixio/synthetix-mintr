import React, { useContext, useState, useEffect } from 'react';

import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { Store } from '../../../store';
import { SliderContext } from '../../../components/ScreenSlider';
import { createTransaction } from '../../../ducks/transactions';
import { updateGasLimit, fetchingGasLimit } from '../../../ducks/network';

import {
  bigNumberFormatter,
  bytesFormatter,
} from '../../../helpers/formatters';

import { GWEI_UNIT, DEFAULT_GAS_LIMIT } from '../../../helpers/networkHelper';
import errorMapper from '../../../helpers/errorMapper';

const useGetWalletSynths = (walletAddress, setBaseSynth) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const getWalletSynths = async () => {
      try {
        let walletSynths = [];

        const synthList = snxJSConnector.synths
          .filter(({ name, asset }) => {
            return name !== 'sUSD' && asset;
          })
          .map(({ name }) => name);

        const balanceResults = await Promise.all(
          synthList.map(synth =>
            snxJSConnector.snxJS[synth].balanceOf(walletAddress)
          )
        );

        balanceResults.forEach((synthBalance, index) => {
          const balance = bigNumberFormatter(synthBalance);
          if (balance && balance > 0)
            walletSynths.push({
              name: synthList[index],
              rawBalance: synthBalance,
              balance,
            });
        });

        const exchangeRatesResults = await snxJSConnector.snxJS.ExchangeRates.ratesForCurrencies(
          walletSynths.map(({ name }) => bytesFormatter(name))
        );

        walletSynths = walletSynths.map((synth, i) => {
          return {
            ...synth,
            rate: bigNumberFormatter(exchangeRatesResults[i]),
          };
        });

        setData(walletSynths);
        setBaseSynth(walletSynths.length > 0 && walletSynths[0]);
      } catch (e) {
        console.log(e);
      }
    };
    getWalletSynths();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);
  return data;
};

const useGetGasEstimate = (baseSynth, baseAmount, currentWallet) => {
  const { dispatch } = useContext(Store);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!baseSynth || baseAmount <= 0) return;
    const getGasEstimate = async () => {
      setError(null);
      let gasEstimate;
      try {
        fetchingGasLimit(dispatch);
        const amountToExchange =
          baseAmount === baseSynth.balance
            ? baseSynth.rawBalance
            : snxJSConnector.utils.parseEther(baseAmount.toString());
        gasEstimate = await snxJSConnector.snxJS.Synthetix.contract.estimate.exchange(
          bytesFormatter(baseSynth.name),
          amountToExchange,
          bytesFormatter('sUSD'),
          currentWallet
        );
      } catch (e) {
        console.log(e);
        const errorMessage =
          (e && e.message) || 'Error while getting gas estimate';
        setError(errorMessage);
        gasEstimate = DEFAULT_GAS_LIMIT['exchange'];
      }
      updateGasLimit(Number(gasEstimate), dispatch);
    };
    getGasEstimate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseSynth, baseAmount, currentWallet]);
  return error;
};

const Trade = ({ onDestroy }) => {
  const { handleNext, handlePrev } = useContext(SliderContext);
  const [baseSynth, setBaseSynth] = useState(null);
  const [baseAmount, setBaseAmount] = useState('');
  const [quoteAmount, setQuoteAmount] = useState('');
  const [transactionInfo, setTransactionInfo] = useState({});
  const {
    state: {
      wallet: { currentWallet, walletType, networkName },
      network: {
        settings: { gasPrice, gasLimit, isFetchingGasLimit },
      },
    },
    dispatch,
  } = useContext(Store);
  const synthBalances = useGetWalletSynths(currentWallet, setBaseSynth);
  const gasEstimateError = useGetGasEstimate(
    baseSynth,
    baseAmount,
    currentWallet
  );

  const onTrade = async () => {
    try {
      const amountToExchange =
        baseAmount === baseSynth.balance
          ? baseSynth.rawBalance
          : snxJSConnector.utils.parseEther(baseAmount.toString());
      handleNext(1);
      const transaction = await snxJSConnector.snxJS.Synthetix.exchange(
        bytesFormatter(baseSynth.name),
        amountToExchange,
        bytesFormatter('sUSD'),
        currentWallet,
        {
          gasPrice: gasPrice * GWEI_UNIT,
          gasLimit,
        }
      );
      if (transaction) {
        setTransactionInfo({ transactionHash: transaction.hash });
        createTransaction(
          {
            hash: transaction.hash,
            status: 'pending',
            info: `Exchanging ${Math.round(baseAmount, 3)} ${
              baseSynth.name
            } to ${Math.round(quoteAmount, 3)} sUSD`,
            hasNotification: true,
          },
          dispatch
        );
        handleNext(2);
      }
    } catch (e) {
      console.log(e);
      const errorMessage = errorMapper(e, walletType);
      console.log(errorMessage);
      setTransactionInfo({
        ...transactionInfo,
        transactionError: errorMessage,
      });
      handleNext(2);
    }
  };
  const props = {
    onDestroy,
    synthBalances,
    baseSynth,
    onTrade,
    baseAmount,
    quoteAmount,
    setBaseAmount,
    setQuoteAmount,
    walletType,
    networkName,
    goBack: handlePrev,
    ...transactionInfo,
    onBaseSynthChange: synth => setBaseSynth(synth),
    isFetchingGasLimit,
    gasEstimateError,
  };

  return [Action, Confirmation, Complete].map((SlideContent, i) => (
    <SlideContent key={i} {...props} />
  ));
};

export default Trade;
