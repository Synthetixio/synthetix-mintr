/* eslint-disable */
import React, { useContext, useState, useEffect } from 'react';
import Slider from '../../../components/Slider';
import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { SliderContext } from '../../../components/Slider';
import { Store } from '../../../store';
import { bytesFormatter } from '../../../helpers/formatters';

const bigNumberFormatter = value =>
  Number(snxJSConnector.utils.formatEther(value));

const useGetIssuanceData = (walletAddress, sUSDBytes) => {
  const [data, setData] = useState({});
  useEffect(() => {
    const getIssuanceData = async () => {
      try {
        const results = await Promise.all([
          snxJSConnector.snxJS.Synthetix.maxIssuableSynths(
            walletAddress,
            sUSDBytes
          ),
          snxJSConnector.snxJS.SynthetixState.issuanceRatio(),
        ]);
        const [maxIssuableSynths, issuanceRatio] = results.map(
          bigNumberFormatter
        );
        setData({ maxIssuableSynths, issuanceRatio });
      } catch (e) {
        console.log(e);
      }
    };
    getIssuanceData();
  }, [walletAddress]);
  return data;
};

const Withdraw = ({ onDestroy }) => {
  const { handleNext, handlePrev } = useContext(SliderContext);
  const [withdrawAmount, setWithdrawAmount] = useState(null);
  const [transactionInfo, setTransactionInfo] = useState({});
  const {
    state: {
      wallet: { currentWallet, walletType, networkName },
    },
  } = useContext(Store);

  const sUSDBytes = bytesFormatter('sUSD');
  const { maxIssuableSynths, issuanceRatio } = useGetIssuanceData(
    currentWallet,
    sUSDBytes
  );
  let transactionError = null;
  const onWithdraw = async amount => {
    try {
      setWithdrawAmount(amount);
      handleNext(1);
      let transaction;
      if (amount === maxIssuableSynths) {
        transaction = await snxJSConnector.snxJS.Synthetix.issueMaxSynths(
          sUSDBytes
        );
      } else {
        transaction = await snxJSConnector.snxJS.Synthetix.issueSynths(
          sUSDBytes,
          snxJSConnector.utils.parseEther(amount.toString())
        );
      }
      if (transaction) {
        setTransactionInfo({ transactionHash: transaction.hash });
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
    onWithdraw,
    maxIssuableSynths,
    goBack: handlePrev,
    walletType,
    networkName,
    withdrawAmount,
    issuanceRatio,
    ...transactionInfo,
  };

  return [Action, Confirmation, Complete].map((SlideContent, i) => (
    <SlideContent key={i} {...props} />
  ));
};

export default Withdraw;
