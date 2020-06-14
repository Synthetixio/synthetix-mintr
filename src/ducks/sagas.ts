import { all } from 'redux-saga/effects';

import { watchFetchDebtStatusRequest } from './debtStatus';
import { watchFetchEscrowRequest } from './escrow';
import { watchFetchBalances } from './balances';
import { watchFetchNetworkRequest } from './network';
import { watchFetchSystemStatusRequest } from './app';

const rootSaga = function* () {
	yield all([
		watchFetchDebtStatusRequest(),
		watchFetchEscrowRequest(),
		watchFetchBalances(),
		watchFetchNetworkRequest(),
		watchFetchSystemStatusRequest(),
	]);
};

export default rootSaga;
