/* eslint-disable */
import React, { useContext } from 'react';
import Slider from '../../../components/Slider';
import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { SliderContext } from '../../../components/Slider';

const Burn = ({ onDestroy }) => {
  const { handleNext, handlePrev } = useContext(SliderContext);

  const onBurn = async amount => {
    const SNXBytes = snxJSConnector.utils.toUtf8Bytes4('sUSD');
    try {
      handleNext(1);
      const transaction = await snxJSConnector.snxJS.Synthetix.burnSynths(
        SNXBytes,
        snxJSConnector.utils.parseEther(amount.toString())
      );
      if (transaction) {
        handleNext(2);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const props = {
    onDestroy,
    onBurn,
  };

  return [Action, Confirmation, Complete].map((SlideContent, i) => (
    <SlideContent key={i} {...props} />
  ));
};

export default Burn;
