import React, { useContext, useState } from 'react';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { Store } from '../../../store';
import { SliderContext } from '../../../components/Slider';

import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

const Withdraw = ({ onDestroy, amountAvailable }) => {
  const { handleNext, handlePrev } = useContext(SliderContext);
  const [transactionInfo, setTransactionInfo] = useState({});
  const {
    state: {
      wallet: { walletType, networkName },
    },
  } = useContext(Store);

  const onWithdraw = async () => {
    try {
      handleNext(1);
      const transaction = await snxJSConnector.snxJS.Depot.contract.withdrawMyDepositedSynths();
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
    goBack: handlePrev,
    amountAvailable,
    ...transactionInfo,
    walletType,
    networkName,
  };

  return [Action, Confirmation, Complete].map((SlideContent, i) => (
    <SlideContent key={i} {...props} />
  ));
};

export default Withdraw;
