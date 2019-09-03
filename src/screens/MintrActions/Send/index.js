import React, { useContext, useState, useEffect } from 'react';
import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { SliderContext } from '../../../components/Slider';
import { Store } from '../../../store';

const bigNumberFormatter = value =>
  Number(snxJSConnector.utils.formatEther(value));

const useGetTransferableSNX = walletAddress => {
  const [data, setData] = useState({});
  useEffect(() => {
    const getTransferableSNX = async () => {
      try {
        const transferable = await snxJSConnector.snxJS.Synthetix.transferableSynthetix(
          walletAddress
        );
        setData(bigNumberFormatter(transferable));
      } catch (e) {
        console.log(e);
      }
    };
    getTransferableSNX();
  }, [walletAddress]);
  return data;
};

const Send = ({ onDestroy }) => {
  const { handleNext, handlePrev } = useContext(SliderContext);
  const [sendOptions, setSendOptions] = useState(null);
  const [transactionInfo, setTransactionInfo] = useState({});
  const {
    state: {
      wallet: { currentWallet, walletType, networkName },
    },
  } = useContext(Store);

  const transferableSNX = useGetTransferableSNX(currentWallet);

  const onSend = async (sendAmount, sendDestination) => {
    try {
      setSendOptions({ sendAmount, sendDestination });
      handleNext(1);
      const transaction = await snxJSConnector.snxJS.Synthetix.transfer(
        sendDestination,
        snxJSConnector.utils.parseEther(sendAmount.toString())
      );
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
    onSend,
    ...sendOptions,
    ...transactionInfo,
    goBack: handlePrev,
    transferableSNX,
    walletType,
    networkName,
  };

  return [Action, Confirmation, Complete].map((SlideContent, i) => (
    <SlideContent key={i} {...props} />
  ));
};

export default Send;
