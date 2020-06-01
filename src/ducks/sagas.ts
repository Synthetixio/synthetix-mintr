import { all } from 'redux-saga/effects';

import { watchFetchDebtStatusRequest } from './debtStatus';

const rootSaga = function* () {
	yield all([watchFetchDebtStatusRequest()]);
};

export default rootSaga;
