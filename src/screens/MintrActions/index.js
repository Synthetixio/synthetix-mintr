import React from 'react';
import Mint from './Mint';
import Slider from '../../components/Slider';

const getActionComponent = action => {
  switch (action) {
    case 'mint':
      return Mint;
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
