import React from 'react';
import Slider from '../../../components/Slider';
import Action from './Action';
import Confirmation from './Confirmation';

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
