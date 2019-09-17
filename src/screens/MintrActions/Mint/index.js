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

import { createTransaction } from '../../../ducks/transactions';
import { updateGasLimit } from '../../../ducks/network';

import { GWEI_UNIT } from '../../../helpers/networkHelper';

const useGetIssuanceData = (walletAddress, sUSDBytes) => {
  const [data, setData] = useState({});
  const SNXBytes = bytesFormatter('SNX');
  useEffect(() => {
    const getIssuanceData = async () => {
      try {
        const results = await Promise.all([
          snxJSConnector.snxJS.Synthetix.maxIssuableSynths(
            walletAddress,
            sUSDBytes
          ),
          snxJSConnector.snxJS.Synthetix.debtBalanceOf(
            walletAddress,
            sUSDBytes
          ),
          snxJSConnector.snxJS.SynthetixState.issuanceRatio(),
          snxJSConnector.snxJS.ExchangeRates.rateForCurrency(SNXBytes),
        ]);
        const [
          maxIssuableSynths,
          debtBalance,
          issuanceRatio,
          SNXPrice,
        ] = results.map(bigNumberFormatter);
        const issuableSynths = Math.max(0, maxIssuableSynths - debtBalance);
        setData({ issuableSynths, debtBalance, issuanceRatio, SNXPrice });
      } catch (e) {
        console.log(e);
      }
    };
    getIssuanceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);
  return data;
};

const useGetGasEstimate = (mintAmount, issuableSynths) => {
  const { dispatch } = useContext(Store);
  useEffect(() => {
    if (mintAmount <= 0) return;
    const sUSDBytes = bytesFormatter('sUSD');
    const getGasEstimate = async () => {
      let gasEstimate;
      try {
        if (mintAmount === issuableSynths) {
          gasEstimate = await snxJSConnector.snxJS.Synthetix.contract.estimate.issueMaxSynths(
            sUSDBytes
          );
        } else {
          gasEstimate = await snxJSConnector.snxJS.Synthetix.contract.estimate.issueSynths(
            sUSDBytes,
            snxJSConnector.utils.parseEther(mintAmount.toString())
          );
        }
        updateGasLimit(Number(gasEstimate), dispatch);
      } catch (e) {
        console.log(e);
      }
    };
    getGasEstimate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mintAmount]);
};

const Mint = ({ onDestroy }) => {
  const { handleNext, handlePrev } = useContext(SliderContext);
  const [mintAmount, setMintAmount] = useState('');
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
  const { issuableSynths, issuanceRatio, SNXPrice } = useGetIssuanceData(
    currentWallet,
    sUSDBytes
  );

  useGetGasEstimate(mintAmount, issuableSynths);

  const onMint = async () => {
    try {
      handleNext(1);
      let transaction;
      if (mintAmount === issuableSynths) {
        transaction = await snxJSConnector.snxJS.Synthetix.issueMaxSynths(
          sUSDBytes,
          {
            gasPrice: gasPrice * GWEI_UNIT,
            gasLimit,
          }
        );
      } else {
        transaction = await snxJSConnector.snxJS.Synthetix.issueSynths(
          sUSDBytes,
          snxJSConnector.utils.parseEther(mintAmount.toString())
        );
      }
      if (transaction) {
        setTransactionInfo({ transactionHash: transaction.hash });
        createTransaction(
          {
            hash: transaction.hash,
            status: 'pending',
            info: `Minting ${mintAmount} sUSD`,
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
    onMint,
    issuableSynths,
    goBack: handlePrev,
    walletType,
    networkName,
    mintAmount,
    setMintAmount,
    issuanceRatio,
    SNXPrice,
    ...transactionInfo,
  };

  return [Action, Confirmation, Complete].map((SlideContent, i) => (
    <SlideContent key={i} {...props} />
  ));
};

export default Mint;
