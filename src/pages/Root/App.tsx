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
import { getCurrentWallet, getWalletDetails } from 'ducks/wallet';

import MaintenancePage from '../MaintenanceMessage';
import NotificationCenter from 'components/NotificationCenter';
import Landing from '../Landing';
import WalletSelection from '../WalletSelection';
import Main from '../Main';
import MobileLanding from '../MobileLanding';

import MainLayout from './components/MainLayout';
import { NotifyProvider } from 'contexts/NotifyContext';
import L2Onboarding from 'pages/L2Onboarding/L2Onboarding';

const mapStateToProps = (state: RootState) => ({
	currentTheme: getCurrentTheme(state),
	currentPage: getCurrentPage(state),
	appIsOnMaintenance: getAppIsOnMaintenance(state),
	currentWallet: getCurrentWallet(state),
	walletDetails: getWalletDetails(state),
});

const connector = connect(mapStateToProps, null);
type PropsFromRedux = ConnectedProps<typeof connector>;

type CurrentPageProps = {
	isOnMaintenance: boolean;
	page: string;
	wallet: string;
};

const CurrentPage: FC<CurrentPageProps> = ({ isOnMaintenance, page, wallet }) => {
	if (isMobileOrTablet()) return <MobileLanding />;
	if (isOnMaintenance) return <MaintenancePage />;
	switch (page) {
		case PAGES_BY_KEY.LANDING:
			return <Landing />;
		case PAGES_BY_KEY.WALLET_SELECTION:
			return <WalletSelection />;
		case PAGES_BY_KEY.MAIN:
			return <Main wallet={wallet} />;
		case PAGES_BY_KEY.L2ONBOARDING:
			return <L2Onboarding />;
		default:
			return <Landing />;
	}
};

type AppProps = {
	appIsReady: boolean;
} & PropsFromRedux;

const App: FC<AppProps> = ({
	appIsReady,
	currentTheme,
	currentPage,
	appIsOnMaintenance,
	currentWallet,
	walletDetails,
}) => {
	const themeStyle = isDarkTheme(currentTheme) ? darkTheme : lightTheme;
	const { networkId } = walletDetails;
	return (
		<NotifyProvider networkId={networkId}>
			<ThemeProvider theme={themeStyle}>
				{appIsReady && (
					<>
						<GlobalEventsGate />
						<MainLayout>
							<CurrentPage
								isOnMaintenance={appIsOnMaintenance}
								page={currentPage}
								wallet={currentWallet}
							/>
							<NotificationCenter />
						</MainLayout>
					</>
				)}
			</ThemeProvider>
		</NotifyProvider>
	);
};

export default connector(App) as any;
