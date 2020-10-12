import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './config/store';

import './index.css';
import Root from './pages/Root';
import './i18n';

ReactDOM.render(
	<Suspense fallback={<div />}>
		<Provider store={store}>
			<Root />
		</Provider>
	</Suspense>,
	document.getElementById('root')
);

if (module.hot) {
	module.hot.accept('./pages/Root', () => {
		ReactDOM.render(
			<Suspense fallback={<div />}>
				<Provider store={store}>
					<Root />
				</Provider>
			</Suspense>,
			document.getElementById('root')
		);
	});
}
