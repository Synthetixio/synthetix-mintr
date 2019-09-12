import React, { useContext, useState } from 'react';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { Store } from '../../../store';
import { SliderContext } from '../../../components/ScreenSlider';

import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

const Deposit = ({ onDestroy, sUSDBalance }) => {
  const { handleNext, handlePrev } = useContext(SliderContext);
  const [depositAmount, setDepositAmount] = useState(null);
  const [transactionInfo, setTransactionInfo] = useState({});
  const {
    state: {
      wallet: { walletType, networkName },
    },
  } = useContext(Store);

  const onDeposit = async amount => {
    try {
      setDepositAmount(amount);
      handleNext(1);
      const depotAddress = snxJSConnector.snxJS.Depot.contract.address;
      const transaction = await snxJSConnector.snxJS.sUSD.contract.transfer(
        depotAddress,
        snxJSConnector.utils.parseEther(amount.toString())
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
    onDeposit,
    goBack: handlePrev,
    sUSDBalance,
    ...transactionInfo,
    depositAmount,
    walletType,
    networkName,
  };

  return [Action, Confirmation, Complete].map((SlideContent, i) => (
    <SlideContent key={i} {...props} />
  ));
};

export default Deposit;
