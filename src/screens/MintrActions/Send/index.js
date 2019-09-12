import React, { useContext, useState, useEffect } from 'react';
import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { SliderContext } from '../../../components/Slider';
import { Store } from '../../../store';
import { createTransaction } from '../../../ducks/transactions';
import {
  bigNumberFormatter,
  shortenAddress,
} from '../../../helpers/formatters';

const useGetBalances = (walletAddress, setCurrentCurrency) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const getBalances = async () => {
      try {
        const [transferable, ethBalance] = await Promise.all([
          snxJSConnector.snxJS.Synthetix.transferableSynthetix(walletAddress),
          snxJSConnector.provider.getBalance(walletAddress),
        ]);
        let walletBalances = [
          {
            name: 'SNX',
            balance: bigNumberFormatter(transferable),
            rawBalance: transferable,
          },
          {
            name: 'ETH',
            balance: bigNumberFormatter(ethBalance),
            rawBalance: ethBalance,
          },
        ];

        const synthList = snxJSConnector.synths
          .filter(({ asset }) => asset)
          .map(({ name }) => name);

        const balanceResults = await Promise.all(
          synthList.map(synth =>
            snxJSConnector.snxJS[synth].balanceOf(walletAddress)
          )
        );

        balanceResults.forEach((synthBalance, index) => {
          const balance = bigNumberFormatter(synthBalance);
          if (balance && balance > 0)
            walletBalances.push({
              name: synthList[index],
              rawBalance: synthBalance,
              balance,
            });
        });
        setData(walletBalances);
        setCurrentCurrency(walletBalances[0]);
      } catch (e) {
        console.log(e);
      }
    };
    getBalances();
  }, [walletAddress]);
  return data;
};

const sendTransaction = (currency, amount, destination) => {
  if (!currency) return null;
  if (currency === 'SNX') {
    return snxJSConnector.snxJS.Synthetix.contract.transfer(
      amount,
      destination
    );
  } else if (currency === 'ETH') {
    return snxJSConnector.signer.sendTransaction({
      value: amount,
      to: destination,
    });
  } else return snxJSConnector.snxJS[currency].contract(amount, destination);
};

const Send = ({ onDestroy }) => {
  const { handleNext, handlePrev } = useContext(SliderContext);
  const [sendOptions, setSendOptions] = useState(null);
  const [currentCurrency, setCurrentCurrency] = useState(null);
  const [transactionInfo, setTransactionInfo] = useState({});
  const {
    state: {
      wallet: { currentWallet, walletType, networkName },
    },
    dispatch,
  } = useContext(Store);

  const balances = useGetBalances(currentWallet, setCurrentCurrency);

  const onSend = async (sendAmount, sendDestination) => {
    try {
      const realSendAmount =
        sendAmount === currentCurrency.balance
          ? currentCurrency.rawBalance
          : snxJSConnector.utils.parseEther(sendAmount.toString());
      setSendOptions({ sendAmount, sendDestination });
      handleNext(1);
      const transaction = await sendTransaction(
        currentCurrency.name,
        realSendAmount,
        sendDestination
      );
      if (transaction) {
        setTransactionInfo({ transactionHash: transaction.hash });
        createTransaction(
          {
            hash: transaction.hash,
            status: 'pending',
            info: `Sending ${Math.round(sendAmount, 3)} ${
              currentCurrency.name
            } to ${shortenAddress(sendDestination)}`,
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
    onSend,
    ...sendOptions,
    ...transactionInfo,
    goBack: handlePrev,
    balances,
    currentCurrency,
    onCurrentCurrencyChange: synth => setCurrentCurrency(synth),
    walletType,
    networkName,
  };

  return [Action, Confirmation, Complete].map((SlideContent, i) => (
    <SlideContent key={i} {...props} />
  ));
};

export default Send;
