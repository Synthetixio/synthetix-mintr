import { hot } from 'react-hot-loader/root';
import React, { useEffect, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { isDarkTheme, lightTheme, darkTheme } from '../../styles/themes';

import { isMobileOrTablet } from '../../helpers/browserHelper';
import { getCurrentPage, getCurrentTheme } from '../../ducks/ui';

import Landing from '../Landing';
import WalletSelection from '../WalletSelection';
import Main from '../Main';
import MaintenanceMessage from '../MaintenanceMessage';
import MobileLanding from '../MobileLanding';

import NotificationCenter from '../../components/NotificationCenter';
import snxJSConnector from '../../helpers/snxJSConnector';
import { getEthereumNetwork } from '../../helpers/networkHelper';

const INTERVAL_TIMER = 5 * 60 * 1000;

const renderCurrentPage = currentPage => {
	if (isMobileOrTablet()) return <MobileLanding />;
	switch (currentPage) {
		case 'landing':
		default:
			return <Landing />;
		case 'walletSelection':
			return <WalletSelection />;
		case 'main':
			return <Main />;
	}
};

const Root = ({ currentPage, currentTheme }) => {
	const themeStyle = isDarkTheme(currentTheme) ? darkTheme : lightTheme;
	const [isOnMaintenance, setIsOnMaintenance] = useState(false);
	const getAppState = useCallback(async () => {
		try {
			setIsOnMaintenance(await snxJSConnector.snxJS.DappMaintenance.isPausedMintr());
		} catch (err) {
			console.log('Could not get DappMaintenance contract data', err);
			setIsOnMaintenance(false);
		}
	}, []);
	useEffect(() => {
		if (process.env.REACT_APP_CONTEXT !== 'production') return;
		let intervalId;
		const init = async () => {
			const { networkId } = await getEthereumNetwork();
			snxJSConnector.setContractSettings({ networkId });
			getAppState();
			intervalId = setInterval(() => {
				getAppState();
			}, INTERVAL_TIMER);
		};
		init();
		return () => {
			clearInterval(intervalId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getAppState]);

	return (
		<ThemeProvider theme={themeStyle}>
			<RootWrapper>
				{isOnMaintenance ? <MaintenanceMessage /> : renderCurrentPage(currentPage)}
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
});

const mapDispatchToProps = {};

export default hot(connect(mapStateToProps, mapDispatchToProps)(Root));
