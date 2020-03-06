import { combineReducers } from 'redux';
import ui from './ui';
import wallet from './wallet';
import transactions from './transactions';
import network from './network';

export default combineReducers({
	ui,
	wallet,
	transactions,
	network,
});
