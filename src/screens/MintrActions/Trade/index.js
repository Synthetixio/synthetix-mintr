import React, { useContext, useState, useEffect } from 'react';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { Store } from '../../../store';
import {
  // bytesFormatter,
  bigNumberFormatter,
} from '../../../helpers/formatters';

import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

const useGetWalletSynths = walletAddress => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const getWalletSynths = async () => {
      try {
        let walletSynths = [];
        const synthList = snxJSConnector.synths
          .filter(({ name, asset }) => {
            return name !== 'sUSD' && asset;
          })
          .map(({ name }) => name);

        const result = await Promise.all(
          synthList.map(synth =>
            snxJSConnector.snxJS[synth].balanceOf(walletAddress)
          )
        );

        result.forEach((synthBalance, index) => {
          const balance = bigNumberFormatter(synthBalance);
          if (balance && balance > 0)
            walletSynths.push({ name: synthList[index], balance });
        });
        setData(walletSynths);
      } catch (e) {
        console.log(e);
      }
    };
    getWalletSynths();
  }, [walletAddress]);
  return data;
};

const Trade = ({ onDestroy }) => {
  const [baseSynth, setBaseSynth] = useState('sUSD');
  const {
    state: {
      wallet: { currentWallet },
    },
  } = useContext(Store);
  const synths = useGetWalletSynths(currentWallet);
  const onTrade = () => {
    try {
      console.log(baseSynth, synths.find(synth => synth.name === baseSynth));
    } catch (e) {
      console.log(e);
    }
  };
  const props = {
    onDestroy,
    synths: synths && synths.map(({ name }) => name),
    baseSynth,
    onTrade,
    onBaseSynthChange: synth => setBaseSynth(synth),
  };

  return [Action, Confirmation, Complete].map((SlideContent, i) => (
    <SlideContent key={i} {...props} />
  ));
};

export default Trade;
