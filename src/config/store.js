import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import reducers from 'ducks';
import rootSaga from 'ducks/sagas';
import createSagaMiddleware from 'redux-saga';

export function persistState(reducerModule, update) {
	try {
		let state = {};
		const serializedState = localStorage.getItem('persistedState');
		if (serializedState !== null) {
			state = JSON.parse(serializedState);
		}
		state[reducerModule] = state[reducerModule] || {};
		Object.assign(state[reducerModule], update);
		localStorage.setItem('persistedState', JSON.stringify(state));
	} catch (err) {
		console.log(err);
	}
}

export function getPersistedState(reducerModule) {
	let persistedState = {};
	try {
		const serializedState = localStorage.getItem('persistedState');
		if (serializedState !== null) {
			persistedState = JSON.parse(serializedState);
			return persistedState[reducerModule];
		}
	} catch (err) {
		console.log(err);
	}

	return {};
}

const sagaMiddleware = createSagaMiddleware();

const middleware = [thunk, sagaMiddleware];

const finalCreateStore = compose(
	applyMiddleware(...middleware),
	window.devToolsExtension ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
)(createStore);

const store = finalCreateStore(reducers);

if (process.env.NODE_ENV !== 'production') {
	if (module.hot) {
		module.hot.accept('ducks', () => {
			const test = require('ducks');
			store.replaceReducer(test);
		});
	}
}

sagaMiddleware.run(rootSaga);

export default store;
