import React, { useContext, useState, useEffect } from 'react';

import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { SliderContext } from '../../../components/ScreenSlider';
import { Store } from '../../../store';
import {
  bytesFormatter,
  bigNumberFormatter,
} from '../../../helpers/formatters';
import { GWEI_UNIT } from '../../../helpers/networkHelper';

import { createTransaction } from '../../../ducks/transactions';
import { updateGasLimit } from '../../../ducks/network';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);
  return data;
};

const useGetGasEstimate = (burnAmount, maxBurnAmount) => {
  const { dispatch } = useContext(Store);
  useEffect(() => {
    if (burnAmount <= 0) return;
    const sUSDBytes = bytesFormatter('sUSD');
    const getGasEstimate = async () => {
      try {
        const amountToBurn =
          burnAmount === maxBurnAmount
            ? Number(maxBurnAmount) + 10
            : burnAmount;
        const gasEstimate = await snxJSConnector.snxJS.Synthetix.contract.estimate.burnSynths(
          sUSDBytes,
          snxJSConnector.utils.parseEther(amountToBurn.toString())
        );
        updateGasLimit(Number(gasEstimate), dispatch);
      } catch (e) {
        console.log(e);
      }
    };
    getGasEstimate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [burnAmount]);
};

const Burn = ({ onDestroy }) => {
  const { handleNext, handlePrev } = useContext(SliderContext);
  const [burnAmount, setBurnAmount] = useState('');
  const [transactionInfo, setTransactionInfo] = useState({});
  const {
    state: {
      wallet: { currentWallet, walletType, networkName },
      network: {
        settings: { gasPrice, gasLimit },
      },
    },
    dispatch,
  } = useContext(Store);

  const sUSDBytes = bytesFormatter('sUSD');
  const { maxBurnAmount, issuanceRatio, SNXPrice } = useGetDebtData(
    currentWallet,
    sUSDBytes
  );

  useGetGasEstimate(burnAmount, maxBurnAmount);

  const onBurn = async () => {
    try {
      handleNext(1);
      const amountToBurn =
        burnAmount === maxBurnAmount ? Number(maxBurnAmount) + 10 : burnAmount;
      const transaction = await snxJSConnector.snxJS.Synthetix.burnSynths(
        sUSDBytes,
        snxJSConnector.utils.parseEther(amountToBurn.toString()),
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
    setBurnAmount,
    walletType,
    networkName,
    SNXPrice,
  };

  return [Action, Confirmation, Complete].map((SlideContent, i) => (
    <SlideContent key={i} {...props} />
  ));
};

export default Burn;
