import { useEffect, FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from 'ducks/types';
import { getCurrentWallet } from 'ducks/wallet';
import { setSystemUpgrading } from 'ducks/app';

const mapStateToProps = (state: RootState) => ({
	currentWallet: getCurrentWallet(state),
});

const mapDispatchToProps = {
	setSystemUpgrading,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const GlobalEventsGate: FC<PropsFromRedux> = ({ currentWallet, setSystemUpgrading }) => {
	useEffect(() => {
		// const {
		// 	//@ts-ignore
		// 	snxJS: { SystemStatus, ExchangeRates },
		// } = snxJSConnector;
		// SystemStatus.contract.on(SYSTEM_STATUS_EVENTS.SYSTEM_SUSPENDED, (reason: number) => {
		// 	setSystemUpgrading({ reason: true });
		// });
		// SystemStatus.contract.on(SYSTEM_STATUS_EVENTS.SYSTEM_RESUMED, () => {
		// 	setSystemUpgrading({ reason: false });
		// });
		// ExchangeRates.contract.on(EXCHANGE_RATES_EVENTS.RATES_UPDATED, () => {
		// 	fetchRatesRequest();
		// });
		// return () => {
		// Object.values(SYSTEM_STATUS_EVENTS).forEach(event =>
		// 	SystemStatus.contract.removeAllListeners(event)
		// );
		// Object.values(EXCHANGE_RATES_EVENTS).forEach(event =>
		// 	ExchangeRates.contract.removeAllListeners(event)
		// );
		// };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return null;
};

export default connector(GlobalEventsGate);
