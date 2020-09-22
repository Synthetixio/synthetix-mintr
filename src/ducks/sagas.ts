import { all } from 'redux-saga/effects';

import { watchFetchDebtStatusRequest } from './debtStatus';
import { watchFetchEscrowRequest } from './escrow';
import { watchFetchBalances } from './balances';
import { watchFetchNetworkRequest } from './network';
// import { watchFetchSystemStatusRequest } from './app';
import { watchFetchRatesRequest } from './rates';

const rootSaga = function* () {
	yield all([
		watchFetchDebtStatusRequest(),
		watchFetchEscrowRequest(),
		watchFetchBalances(),
		watchFetchNetworkRequest(),
		// watchFetchSystemStatusRequest(),
		watchFetchRatesRequest(),
	]);
};

export default rootSaga;
