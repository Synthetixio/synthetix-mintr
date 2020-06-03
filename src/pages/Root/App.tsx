import React, { FC } from 'react';
import { ThemeProvider } from 'styled-components';
import { connect } from 'react-redux';

import { RootState } from 'ducks/types';
import GlobalEventsGate from 'gates/GlobalEventsGate';
import { isDarkTheme, lightTheme, darkTheme } from 'styles/themes';
import { PAGES_BY_KEY, INTERVAL_TIMER } from 'constants/ui';
import { isMobileOrTablet } from 'helpers/browserHelper';
import { getCurrentTheme, getCurrentPage } from 'ducks/ui';
import { getAppIsOnMaintenance } from 'ducks/app';

import MaintenancePage from '../MaintenanceMessage';
import NotificationCenter from 'components/NotificationCenter';
import Landing from '../Landing';
import WalletSelection from '../WalletSelection';
import Main from '../Main';
import MobileLanding from '../MobileLanding';

import MainLayout from './components/MainLayout';

type CurrentPageProps = {
	isOnMaintenance: boolean;
	page: string;
};

const CurrentPage: FC<CurrentPageProps> = ({ isOnMaintenance, page }) => {
	if (isMobileOrTablet()) return <MobileLanding />;
	if (isOnMaintenance) return <MaintenancePage />;
	switch (page) {
		case PAGES_BY_KEY.LANDING:
		default:
			return <Landing />;
		case PAGES_BY_KEY.WALLET_SELECTION:
			return <WalletSelection />;
		case PAGES_BY_KEY.MAIN:
			return <Main />;
	}
};

type StateProps = {
	currentTheme: string;
	currentPage: string;
	appIsOnMaintenance: boolean;
};

type AppProps = StateProps & {
	appIsReady: boolean;
};

const App: FC<AppProps> = ({ appIsReady, currentTheme, currentPage, appIsOnMaintenance }) => {
	const themeStyle = isDarkTheme(currentTheme) ? darkTheme : lightTheme;

	return (
		<ThemeProvider theme={themeStyle}>
			{appIsReady && (
				<>
					<GlobalEventsGate />
					<MainLayout>
						<CurrentPage isOnMaintenance={appIsOnMaintenance} page={currentPage} />
						<NotificationCenter />
					</MainLayout>
				</>
			)}
		</ThemeProvider>
	);
};

const mapStateToProps = (state: RootState) => ({
	currentTheme: getCurrentTheme(state),
	currentPage: getCurrentPage(state),
	appIsOnMaintenance: getAppIsOnMaintenance(state),
});

export default connect<StateProps, null, undefined, RootState>(mapStateToProps, null)(App);
