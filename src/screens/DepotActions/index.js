import React from 'react';
import Deposit from './Deposit';
import Withdraw from './Withdraw';

import Slider from '../../components/ScreenSlider';

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

const DepotAction = props => {
	if (!props.action) return null;
	const ActionComponent = getActionComponent(props.action);
	return (
		<Slider>
			<ActionComponent {...props} />
		</Slider>
	);
};

export default DepotAction;
