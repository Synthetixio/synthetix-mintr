import { all } from 'redux-saga/effects';

import { watchFetchDebtStatusRequest } from './debtStatus';
import { watchFetchEscrowRequest } from './escrow';
import { watchFetchBalances } from './balances';

const rootSaga = function* () {
	yield all([watchFetchDebtStatusRequest(), watchFetchEscrowRequest(), watchFetchBalances()]);
};

export default rootSaga;
