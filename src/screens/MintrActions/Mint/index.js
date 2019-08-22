import React from 'react';
import Slider from '../../../components/Slider';
import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

const Mint = ({ onDestroy }) => {
  const props = {
    onDestroy,
  };
  return (
    <Slider>
      {[Action, Confirmation, Complete].map((SlideContent, i) => (
        <SlideContent key={i} {...props} />
      ))}
    </Slider>
  );
};

export default Mint;
