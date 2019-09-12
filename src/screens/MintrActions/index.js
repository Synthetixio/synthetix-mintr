import React from 'react';
import Mint from './Mint';
import Burn from './Burn';
import Claim from './Claim';
import Trade from './Trade';
import Send from './Send';
import Slider from '../../components/ScreenSlider';

const getActionComponent = action => {
  switch (action) {
    case 'mint':
      return Mint;
    case 'burn':
      return Burn;
    case 'claim':
      return Claim;
    case 'trade':
      return Trade;
    case 'send':
      return Send;
    default:
      return;
  }
};

const MintrAction = ({ action, onDestroy }) => {
  if (!action) return null;
  const ActionComponent = getActionComponent(action);
  return (
    <Slider>
      <ActionComponent onDestroy={onDestroy} />
    </Slider>
  );
};

export default MintrAction;
