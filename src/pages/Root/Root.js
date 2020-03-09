import { hot } from 'react-hot-loader/root';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { isDarkTheme, lightTheme, darkTheme } from '../../styles/themes';

import { isMobileOrTablet } from '../../helpers/browserHelper';

import { getCurrentPage, getCurrentTheme } from '../../ducks/ui';
import { setAppReady, fetchAppStatus, getAppIsOnMaintenance } from '../../ducks/app';

import Landing from '../Landing';
import WalletSelection from '../WalletSelection';
import Main from '../Main';
import MaintenanceMessage from '../MaintenanceMessage';
import MobileLanding from '../MobileLanding';

import NotificationCenter from '../../components/NotificationCenter';
import snxJSConnector from '../../helpers/snxJSConnector';
import { getEthereumNetwork } from '../../helpers/networkHelper';

import { PAGES_BY_KEY } from '../../constants/ui';

const INTERVAL_TIMER = 5 * 60 * 1000;

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

const Root = ({ currentPage, currentTheme, setAppReady, fetchAppStatus, appIsOnMaintenance }) => {
	const themeStyle = isDarkTheme(currentTheme) ? darkTheme : lightTheme;

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
	appIsOnMaintenance: getAppIsOnMaintenance(state),
});

const mapDispatchToProps = {
	setAppReady,
	fetchAppStatus,
};

export default hot(connect(mapStateToProps, mapDispatchToProps)(Root));
