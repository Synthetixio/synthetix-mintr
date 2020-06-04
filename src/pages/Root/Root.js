import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { setAppReady, getAppIsOnMaintenance, getAppIsReady } from 'ducks/app';
import { getCurrentPage } from 'ducks/ui';
import { fetchDebtStatusRequest } from 'ducks/debtStatus';
import { fetchEscrowRequest } from 'ducks/escrow';
import { getCurrentWallet } from 'ducks/wallet';
import { fetchBalancesRequest } from 'ducks/balances';

import App from './App';

import snxJSConnector from 'helpers/snxJSConnector';
import { getEthereumNetwork } from 'helpers/networkHelper';

import { INTERVAL_TIMER } from 'constants/ui';

const Root = ({
	currentPage,
	setAppReady,
	fetchAppStatus,
	appIsOnMaintenance,
	appIsReady,
	fetchDebtStatusRequest,
	currentWallet,
	fetchEscrowRequest,
	fetchBalancesRequest,
}) => {
	useEffect(() => {
		if (appIsReady && currentWallet) {
			fetchDebtStatusRequest();
			fetchEscrowRequest();
			fetchBalancesRequest();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [appIsReady, currentWallet]);

	useEffect(() => {
		let intervalId;
		const init = async () => {
			const { networkId } = await getEthereumNetwork();
			snxJSConnector.setContractSettings({ networkId });
			setAppReady();

			intervalId = setInterval(() => {}, INTERVAL_TIMER);
		};
		init();
		return () => {
			clearInterval(intervalId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <App appIsReady={appIsReady} />;
};

const mapStateToProps = state => ({
	currentPage: getCurrentPage(state),
	appIsOnMaintenance: getAppIsOnMaintenance(state),
	appIsReady: getAppIsReady(state),
	currentWallet: getCurrentWallet(state),
});

const mapDispatchToProps = {
	setAppReady,
	fetchDebtStatusRequest,
	fetchEscrowRequest,
	fetchBalancesRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Root);
