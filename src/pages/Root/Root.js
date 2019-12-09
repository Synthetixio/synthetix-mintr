import { hot } from 'react-hot-loader/root';
import React, { Suspense, useEffect, useContext, useCallback, useState } from 'react';
import styled from 'styled-components';

import { isMobileOrTablet } from '../../helpers/browserHelper';
import { Store } from '../../store';

import Landing from '../Landing';
import WalletSelection from '../WalletSelection';
import Main from '../Main';
import MaintenanceMessage from '../MaintenanceMessage';
import MobileLanding from '../MobileLanding';

import NotificationCenter from '../../components/NotificationCenter';
import snxJSConnector from '../../helpers/snxJSConnector';
import { getEthereumNetwork } from '../../helpers/networkHelper';

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

const Root = () => {
	const [intervalId, setIntervalId] = useState(null);
	const [isOnMaintenance, setIsOnMaintenance] = useState(false);
	const {
		state: {
			ui: { currentPage },
		},
	} = useContext(Store);
	const getAppState = useCallback(async () => {
		try {
			setIsOnMaintenance(await snxJSConnector.snxJS.DappMaintenance.isPausedMintr());
		} catch (err) {
			console.log('Could not get DappMaintenance contract data', err);
			setIsOnMaintenance(false);
		}
	}, []);
	useEffect(() => {
		// if (process.env.REACT_APP_CONTEXT !== 'production') return;
		const init = async () => {
			const { networkId } = await getEthereumNetwork();
			snxJSConnector.setContractSettings({ networkId });
			getAppState();
			const intervalId = setInterval(() => {
				getAppState();
			}, 30 * 1000);
			setIntervalId(intervalId);
		};
		init();
		return () => {
			clearInterval(intervalId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getAppState]);

	return (
		<Suspense fallback={<div></div>}>
			<RootWrapper>
				{isOnMaintenance ? <MaintenanceMessage /> : renderCurrentPage(currentPage)}
				<NotificationCenter></NotificationCenter>
			</RootWrapper>
		</Suspense>
	);
};

const RootWrapper = styled('div')`
	position: relative;
	background: ${props => props.theme.colorStyles.background};
	width: 100%;
`;

export default hot(Root);
