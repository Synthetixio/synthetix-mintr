import { combineReducers } from 'redux';
import app from './app';
import ui from './ui';
import rates from './rates';
import wallet from './wallet';
import transactions from './transactions';
import transactionHistory from './transactionHistory';
import network from './network';
import modal from './modal';

export default combineReducers({
	app,
	ui,
	rates,
	wallet,
	transactions,
	transactionHistory,
	network,
	modal,
});
