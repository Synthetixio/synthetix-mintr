import { combineReducers } from 'redux';
import app from './app';
import ui from './ui';
import rates from './rates';
import wallet from './wallet';
import transactions from './transactions';
import network from './network';

export default combineReducers({
	app,
	ui,
	rates,
	wallet,
	transactions,
	network,
});
