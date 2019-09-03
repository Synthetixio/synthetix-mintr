import React from 'react';
import Deposit from './Deposit';
import Withdraw from './Withdraw';

import Slider from '../../components/Slider';

const getActionComponent = action => {
  switch (action) {
    case 'deposit':
      return Deposit;
    case 'withdraw':
      return Withdraw;
    default:
      return;
  }
};

const DepotAction = ({ action, onDestroy }) => {
  if (!action) return null;
  const ActionComponent = getActionComponent(action);
  return (
    <Slider>
      <ActionComponent onDestroy={onDestroy} />
    </Slider>
  );
};

export default DepotAction;
