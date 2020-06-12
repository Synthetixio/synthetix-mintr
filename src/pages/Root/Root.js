import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { setAppReady, getAppIsReady } from 'ducks/app';
import { getCurrentPage } from 'ducks/ui';
import { fetchDebtStatusRequest } from 'ducks/debtStatus';
import { fetchEscrowRequest } from 'ducks/escrow';
import { getCurrentWallet } from 'ducks/wallet';
import { fetchBalancesRequest } from 'ducks/balances';
import { fetchGasPricesRequest } from 'ducks/network';

import App from './App';

import snxJSConnector from 'helpers/snxJSConnector';
import { getEthereumNetwork } from 'helpers/networkHelper';

const Root = ({
	currentPage,
	setAppReady,
	fetchAppStatus,
	appIsReady,
	fetchDebtStatusRequest,
	currentWallet,
	fetchEscrowRequest,
	fetchBalancesRequest,
	fetchGasPricesRequest,
}) => {
	const [appIsOnMaintenance, setAppIsOnMaintenance] = useState(false);

	useEffect(() => {
		const startSystemStatusListeners = async () => {
			if (!appIsReady) return;
			const {
				snxJS: { SystemStatus },
			} = snxJSConnector;
			try {
				const isSystemUpgrading = await SystemStatus.isSystemUpgrading();
				if (Number(isSystemUpgrading)) setAppIsOnMaintenance(true);
				SystemStatus.contract.on('SystemSuspended', reason => {
					if (Number(reason) === 1) setAppIsOnMaintenance(true);
				});
				SystemStatus.contract.on('SystemResumed', () => {
					setAppIsOnMaintenance(false);
				});
			} catch (e) {
				console.log(e);
			}
		};
		if (appIsReady && currentWallet) {
			fetchDebtStatusRequest();
			fetchEscrowRequest();
			fetchBalancesRequest();
		}
		startSystemStatusListeners();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [appIsReady, currentWallet]);

	useEffect(() => {
		fetchGasPricesRequest();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [appIsReady]);

	useEffect(() => {
		const init = async () => {
			const { networkId } = await getEthereumNetwork();
			snxJSConnector.setContractSettings({ networkId });
			setAppReady();
		};
		init();
		return () => {
			if (!appIsReady) return;
			const {
				snxJS: { SystemStatus },
			} = snxJSConnector;
			SystemStatus.contract.removeAllListeners('SystemSuspended');
			SystemStatus.contract.removeAllListeners('SystemResumed');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <App appIsReady={appIsReady} appIsOnMaintenance={appIsOnMaintenance} />;
};

const mapStateToProps = state => ({
	currentPage: getCurrentPage(state),
	appIsReady: getAppIsReady(state),
	currentWallet: getCurrentWallet(state),
});

const mapDispatchToProps = {
	setAppReady,
	fetchDebtStatusRequest,
	fetchEscrowRequest,
	fetchBalancesRequest,
	fetchGasPricesRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Root);
