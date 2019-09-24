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
import { GWEI_UNIT, DEFAULT_GAS_LIMIT } from '../../../helpers/networkHelper';
import errorMapper from '../../../helpers/errorMapper';
import { createTransaction } from '../../../ducks/transactions';
import { updateGasLimit, fetchingGasLimit } from '../../../ducks/network';

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
          snxJSConnector.snxJS.RewardEscrow.totalEscrowedAccountBalance(
            walletAddress
          ),
          snxJSConnector.snxJS.SynthetixEscrow.balanceOf(walletAddress),
        ]);
        const [
          debt,
          sUSDBalance,
          issuanceRatio,
          SNXPrice,
          totalRewardEscrow,
          totalTokenSaleEscrow,
        ] = results.map(bigNumberFormatter);
        setData({
          issuanceRatio,
          maxBurnAmount: Math.min(debt, sUSDBalance),
          SNXPrice,
          escrowBalance: totalRewardEscrow + totalTokenSaleEscrow,
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

const useGetGasEstimate = maxBurnAmount => {
  const { dispatch } = useContext(Store);
  const [error, setError] = useState(null);
  useEffect(() => {
    const sUSDBytes = bytesFormatter('sUSD');
    const getGasEstimate = async () => {
      setError(null);
      let gasEstimate;
      try {
        if (maxBurnAmount === 0) throw new Error();
        fetchingGasLimit(dispatch);
        gasEstimate = await snxJSConnector.snxJS.Synthetix.contract.estimate.burnSynths(
          sUSDBytes,
          0
        );
      } catch (e) {
        console.log(e);
        let errorMessage;
        if (!maxBurnAmount || maxBurnAmount === 0) {
          errorMessage = 'You have no sUSD left to burn';
        } else {
          errorMessage = (e && e.message) || 'Error while getting gas estimate';
        }
        setError(errorMessage);
        gasEstimate = DEFAULT_GAS_LIMIT['burn'];
      }
      updateGasLimit(Number(gasEstimate), dispatch);
    };
    getGasEstimate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxBurnAmount]);
  return error;
};

const Burn = ({ onDestroy }) => {
  const { handleNext, handlePrev } = useContext(SliderContext);
  const [burnAmount, setBurnAmount] = useState('');
  const [transferableAmount, setTransferableAmount] = useState('');
  const [transactionInfo, setTransactionInfo] = useState({});
  const {
    state: {
      wallet: { currentWallet, walletType, networkName },
      network: {
        settings: { gasPrice, gasLimit, isFetchingGasLimit },
      },
    },
    dispatch,
  } = useContext(Store);

  const sUSDBytes = bytesFormatter('sUSD');
  const {
    maxBurnAmount,
    issuanceRatio,
    SNXPrice,
    escrowBalance,
  } = useGetDebtData(currentWallet, sUSDBytes);
  const gasEstimateError = useGetGasEstimate(maxBurnAmount);
  const onBurn = async () => {
    try {
      handleNext(1);
      const amountToBurn =
        burnAmount === maxBurnAmount
          ? Number(maxBurnAmount) + 10
          : Number(burnAmount);
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
      console.log(e);
      const errorMessage = errorMapper(e, walletType);
      console.log(errorMessage);
      setTransactionInfo({
        ...transactionInfo,
        transactionError: errorMessage,
      });
      handleNext(2);
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
    setBurnAmount: amount => {
      const amountNB = Number(amount);
      setBurnAmount(amountNB);
      setTransferableAmount(
        Math.max(amountNB / issuanceRatio / SNXPrice - escrowBalance, 0) || ''
      );
    },
    transferableAmount,
    setTransferableAmount: amount => {
      const amountNB = Number(amount);
      setBurnAmount(
        amountNB > 0
          ? (escrowBalance + amountNB) * issuanceRatio * SNXPrice
          : ''
      );
      setTransferableAmount(amount);
    },
    walletType,
    networkName,
    SNXPrice,
    isFetchingGasLimit,
    gasEstimateError,
  };

  return [Action, Confirmation, Complete].map((SlideContent, i) => (
    <SlideContent key={i} {...props} />
  ));
};

export default Burn;
