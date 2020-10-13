import React, { FC } from 'react';
import { ThemeProvider } from 'styled-components';
import { connect, ConnectedProps } from 'react-redux';

import GlobalEventsGate from 'gates/GlobalEventsGate';
import { RootState } from 'ducks/types';
import { getAppIsOnMaintenance } from 'ducks/app';
import { isDarkTheme, lightTheme, darkTheme } from 'styles/themes';
import { PAGES_BY_KEY } from 'constants/ui';
import { isMobileOrTablet } from 'helpers/browserHelper';
import { getCurrentTheme, getCurrentPage } from 'ducks/ui';

import MaintenancePage from '../MaintenanceMessage';
import Soonthetix from '../Soonthetix';
import NotificationCenter from 'components/NotificationCenter';
import Landing from '../Landing';
import WalletSelection from '../WalletSelection';
import Main from '../Main';
import MobileLanding from '../MobileLanding';

import MainLayout from './components/MainLayout';

const mapStateToProps = (state: RootState) => ({
	currentTheme: getCurrentTheme(state),
	currentPage: getCurrentPage(state),
	appIsOnMaintenance: getAppIsOnMaintenance(state),
});

const connector = connect(mapStateToProps, null);
type PropsFromRedux = ConnectedProps<typeof connector>;

type CurrentPageProps = {
	isOnMaintenance: boolean;
	page: string;
};

const CurrentPage: FC<CurrentPageProps> = ({ isOnMaintenance, page }) => {
	// return <Soonthetix />;
	if (isMobileOrTablet()) return <MobileLanding />;
	if (isOnMaintenance) return <MaintenancePage />;
	switch (page) {
		case PAGES_BY_KEY.LANDING:
			return <Landing />;
		case PAGES_BY_KEY.WALLET_SELECTION:
			return <WalletSelection />;
		case PAGES_BY_KEY.MAIN:
			return <Main />;
		default:
			return <Landing />;
	}
};

type AppProps = {
	appIsReady: boolean;
} & PropsFromRedux;

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

export default connector(App) as any;
