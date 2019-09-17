import React, { useContext, useState, useEffect } from 'react';
import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { SliderContext } from '../../../components/ScreenSlider';
import { Store } from '../../../store';
import { createTransaction } from '../../../ducks/transactions';
import { updateGasLimit } from '../../../ducks/network';
import {
  bigNumberFormatter,
  shortenAddress,
} from '../../../helpers/formatters';
import { GWEI_UNIT } from '../../../helpers/networkHelper';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);
  return data;
};

const useGetGasEstimate = (currency, amount, destination) => {
  const { dispatch } = useContext(Store);
  useEffect(() => {
    if (!currency || !currency.name || !amount || !destination)
      return updateGasLimit(0, dispatch);
    const getGasEstimate = async () => {
      try {
        let gasEstimate;
        if (currency.name === 'SNX') {
          gasEstimate = await snxJSConnector.snxJS.Synthetix.contract.estimate.transfer(
            destination,
            snxJSConnector.utils.parseEther(amount.toString())
          );
        } else if (currency.name === 'ETH') {
          gasEstimate = await snxJSConnector.provider.estimateGas({
            value: amount,
            to: destination,
          });
        } else {
          gasEstimate = await snxJSConnector.snxJS[
            currency.name
          ].contract.estimate.transfer(destination, amount);
        }
        updateGasLimit(Number(gasEstimate), dispatch);
      } catch (e) {
        console.log(e);
      }
    };
    getGasEstimate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, currency, destination]);
};

const sendTransaction = (currency, amount, destination, settings) => {
  if (!currency) return null;
  if (currency === 'SNX') {
    return snxJSConnector.snxJS.Synthetix.contract.transfer(
      destination,
      amount,
      settings
    );
  } else if (currency === 'ETH') {
    return snxJSConnector.signer.sendTransaction({
      value: amount,
      to: destination,
      ...settings,
    });
  } else
    return snxJSConnector.snxJS[currency].contract.transfer(
      amount,
      destination,
      settings
    );
};

const Send = ({ onDestroy }) => {
  const { handleNext, handlePrev } = useContext(SliderContext);
  const [sendAmount, setSendAmount] = useState('');
  const [sendDestination, setSendDestination] = useState('');
  const [currentCurrency, setCurrentCurrency] = useState(null);
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

  const balances = useGetBalances(currentWallet, setCurrentCurrency);
  useGetGasEstimate(currentCurrency, sendAmount, sendDestination);

  const onSend = async () => {
    try {
      const realSendAmount =
        sendAmount === currentCurrency.balance
          ? currentCurrency.rawBalance
          : snxJSConnector.utils.parseEther(sendAmount.toString());
      handleNext(1);
      const transaction = await sendTransaction(
        currentCurrency.name,
        realSendAmount,
        sendDestination,
        { gasPrice: gasPrice * GWEI_UNIT, gasLimit }
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
    sendAmount,
    sendDestination,
    setSendAmount,
    setSendDestination,
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
