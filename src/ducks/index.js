import { combineReducers } from 'redux';
import app from './app';
import ui from './ui';
import wallet from './wallet';
import transactions from './transactions';
import network from './network';

export default combineReducers({
	app,
	ui,
	wallet,
	transactions,
	network,
});
