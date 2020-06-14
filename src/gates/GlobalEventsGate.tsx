import { useEffect, FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from 'ducks/types';
import { fetchDebtStatusRequest } from 'ducks/debtStatus';
import { getCurrentWallet } from 'ducks/wallet';
import { setSystemUpgrading } from 'ducks/app';

import snxJSConnector from 'helpers/snxJSConnector';
import {
	ISSUANCE_EVENTS,
	FEEPOOL_EVENTS,
	EXCHANGE_EVENTS,
	TRANSFER_EVENTS,
	SYSTEM_STATUS_EVENTS,
} from 'constants/events';

const mapStateToProps = (state: RootState) => ({
	currentWallet: getCurrentWallet(state),
});

const mapDispatchToProps = {
	fetchDebtStatusRequest,
	setSystemUpgrading,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const GlobalEventsGate: FC<PropsFromRedux> = ({
	fetchDebtStatusRequest,
	currentWallet,
	setSystemUpgrading,
}) => {
	useEffect(() => {
		if (!currentWallet) return;
		const {
			//@ts-ignore
			snxJS: { sUSD, FeePool, Synthetix },
		} = snxJSConnector;
		sUSD.contract.on(ISSUANCE_EVENTS.ISSUED, (account: string) => {
			console.log('issued');
			if (account === currentWallet) fetchDebtStatusRequest();
		});
		sUSD.contract.on(ISSUANCE_EVENTS.BURNED, (account: string) => {
			console.log('burned');
			if (account === currentWallet) fetchDebtStatusRequest();
		});
		FeePool.contract.on(FEEPOOL_EVENTS.CLAIMED, (account: string) => {
			console.log('claimed');
			if (account === currentWallet) fetchDebtStatusRequest();
		});
		Synthetix.contract.on(EXCHANGE_EVENTS.SYNTH_EXCHANGE, (address: string) => {
			console.log('synth exchange');
			if (address === currentWallet) fetchDebtStatusRequest();
		});
		Synthetix.contract.on(TRANSFER_EVENTS.TRANSFER, (address: string) => {
			console.log('SNX transfer');
			if (address === currentWallet) fetchDebtStatusRequest();
		});
		sUSD.contract.on(TRANSFER_EVENTS.TRANSFER, (address: string) => {
			console.log('sUSD transfer');
			if (address === currentWallet) fetchDebtStatusRequest();
		});

		return () => {
			Object.values(ISSUANCE_EVENTS).forEach(event => sUSD.contract.removeAllListeners(event));
			Object.values(FEEPOOL_EVENTS).forEach(event => FeePool.contract.removeAllListeners(event));
			Object.values(EXCHANGE_EVENTS).forEach(event => Synthetix.contract.removeAllListeners(event));
			Object.values(TRANSFER_EVENTS).forEach(event => Synthetix.contract.removeAllListeners(event));
			Object.values(TRANSFER_EVENTS).forEach(event => sUSD.contract.removeAllListeners(event));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet]);

	useEffect(() => {
		const {
			//@ts-ignore
			snxJS: { SystemStatus },
		} = snxJSConnector;
		SystemStatus.contract.on(SYSTEM_STATUS_EVENTS.SYSTEM_SUSPENDED, (reason: number) => {
			setSystemUpgrading({ reason });
		});
		SystemStatus.contract.on(SYSTEM_STATUS_EVENTS.SYSTEM_RESUMED, (reason: number) => {
			setSystemUpgrading({ reason });
		});
		return () => {
			Object.values(SYSTEM_STATUS_EVENTS).forEach(event =>
				SystemStatus.contract.removeAllListeners(event)
			);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return null;
};

export default connector(GlobalEventsGate);
