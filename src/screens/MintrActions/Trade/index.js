import React, { useContext, useState, useEffect } from 'react';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { Store } from '../../../store';
import { SliderContext } from '../../../components/ScreenSlider';
import { createTransaction } from '../../../ducks/transactions';

import {
  bigNumberFormatter,
  bytesFormatter,
} from '../../../helpers/formatters';

import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

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
  }, [walletAddress]);
  return data;
};

const Trade = ({ onDestroy }) => {
  const { handleNext, handlePrev } = useContext(SliderContext);
  const [baseSynth, setBaseSynth] = useState(null);
  const [tradeAmount, setTradeAmount] = useState(null);
  const [transactionInfo, setTransactionInfo] = useState({});
  const {
    state: {
      wallet: { currentWallet, walletType, networkName },
    },
    dispatch,
  } = useContext(Store);
  const synthBalances = useGetWalletSynths(currentWallet, setBaseSynth);
  const onTrade = async (baseAmount, quoteAmount) => {
    try {
      setTradeAmount({ base: baseAmount, quote: quoteAmount });
      const amountToExchange =
        baseAmount === baseSynth.balance
          ? baseSynth.rawBalance
          : snxJSConnector.utils.parseEther(baseAmount.toString());
      handleNext(1);
      const transaction = await snxJSConnector.snxJS.Synthetix.exchange(
        bytesFormatter(baseSynth.name),
        amountToExchange,
        bytesFormatter('sUSD'),
        currentWallet
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
      setTransactionInfo({ ...transactionInfo, transactionError: e });
      handleNext(2);
      console.log(e);
    }
  };
  const props = {
    onDestroy,
    synthBalances,
    baseSynth,
    onTrade,
    tradeAmount,
    walletType,
    networkName,
    goBack: handlePrev,
    ...transactionInfo,

    onBaseSynthChange: synth => setBaseSynth(synth),
  };

  return [Action, Confirmation, Complete].map((SlideContent, i) => (
    <SlideContent key={i} {...props} />
  ));
};

export default Trade;
