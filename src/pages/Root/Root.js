import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { isDarkTheme, lightTheme, darkTheme } from '../../styles/themes';

import { isMobileOrTablet } from '../../helpers/browserHelper';

import { getCurrentPage, getCurrentTheme } from '../../ducks/ui';
import { setAppReady, fetchAppStatus, getAppIsReady } from '../../ducks/app';

import Landing from '../Landing';
import WalletSelection from '../WalletSelection';
import Main from '../Main';
import MaintenanceMessage from '../MaintenanceMessage';
import MobileLanding from '../MobileLanding';

import NotificationCenter from '../../components/NotificationCenter';
import snxJSConnector from '../../helpers/snxJSConnector';
import { getEthereumNetwork } from '../../helpers/networkHelper';

import { PAGES_BY_KEY } from '../../constants/ui';

const renderCurrentPage = currentPage => {
	if (isMobileOrTablet()) return <MobileLanding />;
	switch (currentPage) {
		case PAGES_BY_KEY.LANDING:
		default:
			return <Landing />;
		case PAGES_BY_KEY.WALLET_SELECTION:
			return <WalletSelection />;
		case PAGES_BY_KEY.MAIN:
			return <Main />;
	}
};

const Root = ({ currentPage, currentTheme, setAppReady, fetchAppStatus, appIsReady }) => {
	const themeStyle = isDarkTheme(currentTheme) ? darkTheme : lightTheme;
	const [appIsOnMaintenance, setAppIsOnMaintenance] = useState(false);

	useEffect(() => {
		const init = async () => {
			const { networkId } = await getEthereumNetwork();
			snxJSConnector.setContractSettings({ networkId });
			setAppReady();
		};
		init();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
		startSystemStatusListeners();

		return () => {
			if (!appIsReady) return;
			const {
				snxJS: { SystemStatus },
			} = snxJSConnector;
			SystemStatus.contract.removeAllListeners('SystemSuspended');
			SystemStatus.contract.removeAllListeners('SystemResumed');
		};
	}, [appIsReady]);

	return (
		<ThemeProvider theme={themeStyle}>
			<RootWrapper>
				{appIsOnMaintenance ? <MaintenanceMessage /> : renderCurrentPage(currentPage)}
				<NotificationCenter></NotificationCenter>
			</RootWrapper>
		</ThemeProvider>
	);
};

const RootWrapper = styled('div')`
	position: relative;
	background: ${props => props.theme.colorStyles.background};
	width: 100%;
`;

const mapStateToProps = state => ({
	currentPage: getCurrentPage(state),
	currentTheme: getCurrentTheme(state),
	appIsReady: getAppIsReady(state),
});

const mapDispatchToProps = {
	setAppReady,
	fetchAppStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(Root);
