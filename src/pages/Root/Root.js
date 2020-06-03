import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { setAppReady, fetchAppStatus, getAppIsOnMaintenance, getAppIsReady } from 'ducks/app';
import { getCurrentPage } from 'ducks/ui';
import { fetchDebtStatusRequest } from 'ducks/debtStatus';
import { getCurrentWallet } from 'ducks/wallet';

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
}) => {
	useEffect(() => {
		if (appIsReady && currentWallet) {
			fetchDebtStatusRequest();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [appIsReady, currentWallet]);

	useEffect(() => {
		let intervalId;
		const init = async () => {
			const { networkId } = await getEthereumNetwork();
			snxJSConnector.setContractSettings({ networkId });
			setAppReady();
			fetchAppStatus();
			intervalId = setInterval(() => {
				fetchAppStatus();
			}, INTERVAL_TIMER);
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
	fetchAppStatus,
	fetchDebtStatusRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Root);
