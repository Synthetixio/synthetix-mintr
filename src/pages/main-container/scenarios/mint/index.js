import React from 'react';
import Slider from '../../../../components/slider';
import Action from './action';
import Confirmation from './confirmation';

const Mint = ({ onDestroy }) => {
  const props = {
    onDestroy,
  };
  return (
    <Slider>
      {[Action, Confirmation].map((SlideContent, i) => (
        <SlideContent key={i} {...props} />
      ))}
    </Slider>
  );
};

export default Mint;
