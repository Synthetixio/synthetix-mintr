import { combineReducers } from 'redux';
import app from './app';
import ui from './ui';
import rates from './rates';
import wallet from './wallet';
import transactions from './transactions';
import transactionHistory from './transactionHistory';
import depotHistory from './depotHistory';
import network from './network';
import modal from './modal';
import balances from './balances';

export default combineReducers({
	app,
	ui,
	rates,
	wallet,
	transactions,
	transactionHistory,
	depotHistory,
	network,
	modal,
	balances,
});
