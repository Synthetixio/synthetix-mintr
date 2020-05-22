import React from 'react';
import Mint from './Mint';
import Burn from './Burn';
import Claim from './Claim';
import Trade from './Trade';
import Send from './Transfer';
import Track from './Track';
import Slider from '../../components/ScreenSlider';
import { ACTIONS_MAP } from '../../constants/actions';

const getActionComponent = action => {
	switch (action) {
		case ACTIONS_MAP.mint:
			return Mint;
		case ACTIONS_MAP.burn:
			return Burn;
		case ACTIONS_MAP.claim:
			return Claim;
		case ACTIONS_MAP.trade:
			return Trade;
		case ACTIONS_MAP.transfer:
			return Send;
		case ACTIONS_MAP.track:
			return Track;
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
