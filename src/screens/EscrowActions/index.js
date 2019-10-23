import React from 'react';
import TokenSaleVesting from './TokenSaleVesting';
import RewardsVesting from './RewardsVesting';

import Slider from '../../components/ScreenSlider';

const getActionComponent = action => {
  switch (action) {
    case 'tokenSaleVesting':
      return TokenSaleVesting;
    case 'rewardsVesting':
      return RewardsVesting;
    default:
      return;
  }
};

const EscrowActions = ({ action, onDestroy, vestAmount }) => {
  if (!action) return null;
  const ActionComponent = getActionComponent(action);
  return (
    <Slider>
      <ActionComponent onDestroy={onDestroy} vestAmount={vestAmount} />
    </Slider>
  );
};

export default EscrowActions;
