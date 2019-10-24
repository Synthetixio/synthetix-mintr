import UIReducer from './ui';
import WalletReducer from './wallet';
import TransactionsReducer from './transactions';
import NetworkReducer from './network';

const combineReducers = reducers => (state, action) => {
	let hasChanged;
	const nextState = Object.keys(reducers).reduce((result, key) => {
		result[key] = reducers[key](state[key], action);
		hasChanged = hasChanged || result[key] !== state[key];
		return result;
	}, {});
	return hasChanged ? nextState : state;
};

export default combineReducers({
	ui: UIReducer,
	wallet: WalletReducer,
	transactions: TransactionsReducer,
	network: NetworkReducer,
});
