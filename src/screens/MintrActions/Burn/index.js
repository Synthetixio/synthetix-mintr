import React, { useContext, useState, useEffect } from 'react';

import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { SliderContext } from '../../../components/Slider';
import { Store } from '../../../store';
import {
  bytesFormatter,
  bigNumberFormatter,
} from '../../../helpers/formatters';

import { createTransaction } from '../../../ducks/transactions';

const useGetDebtData = (walletAddress, sUSDBytes) => {
  const [data, setData] = useState({});
  const SNXBytes = bytesFormatter('SNX');
  useEffect(() => {
    const getDebtData = async () => {
      try {
        const results = await Promise.all([
          snxJSConnector.snxJS.Synthetix.debtBalanceOf(
            walletAddress,
            sUSDBytes
          ),
          snxJSConnector.snxJS.sUSD.balanceOf(walletAddress),
          snxJSConnector.snxJS.SynthetixState.issuanceRatio(),
          snxJSConnector.snxJS.ExchangeRates.rateForCurrency(SNXBytes),
        ]);
        const [debt, sUSDBalance, issuanceRatio, SNXPrice] = results.map(
          bigNumberFormatter
        );
        setData({
          issuanceRatio,
          maxBurnAmount: Math.min(debt, sUSDBalance),
          SNXPrice,
        });
      } catch (e) {
        console.log(e);
      }
    };
    getDebtData();
  }, [walletAddress]);
  return data;
};

const Burn = ({ onDestroy }) => {
  const { handleNext, handlePrev } = useContext(SliderContext);
  const [burnAmount, setBurnAmount] = useState(null);
  const [transactionInfo, setTransactionInfo] = useState({});
  const {
    state: {
      wallet: { currentWallet, walletType, networkName },
    },
    dispatch,
  } = useContext(Store);

  const sUSDBytes = bytesFormatter('sUSD');
  const { maxBurnAmount, issuanceRatio, SNXPrice } = useGetDebtData(
    currentWallet,
    sUSDBytes
  );

  const onBurn = async amount => {
    try {
      setBurnAmount(amount);
      handleNext(1);
      const amountToBurn =
        amount === maxBurnAmount ? Number(maxBurnAmount) + 10 : amount;
      const transaction = await snxJSConnector.snxJS.Synthetix.burnSynths(
        sUSDBytes,
        snxJSConnector.utils.parseEther(amountToBurn.toString())
      );
      if (transaction) {
        setTransactionInfo({ transactionHash: transaction.hash });
        createTransaction(
          {
            hash: transaction.hash,
            status: 'pending',
            info: `Burning ${amountToBurn} sUSD`,
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
    onBurn,
    goBack: handlePrev,
    maxBurnAmount,
    issuanceRatio,
    ...transactionInfo,
    burnAmount,
    walletType,
    networkName,
    SNXPrice,
  };

  return [Action, Confirmation, Complete].map((SlideContent, i) => (
    <SlideContent key={i} {...props} />
  ));
};

export default Burn;
