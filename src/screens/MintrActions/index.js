import React from 'react';
import Mint from './Mint';
import Burn from './Burn';
import Trade from './Trade';
import Send from './Send';
import Slider from '../../components/Slider';

const getActionComponent = action => {
  switch (action) {
    case 'mint':
      return Mint;
    case 'burn':
      return Burn;
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
      <ActionComponent onDestroy={onDestroy}></ActionComponent>
    </Slider>
  );
};

export default MintrAction;
