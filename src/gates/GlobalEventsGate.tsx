import { useEffect, FC } from 'react';
import { connect } from 'react-redux';

import { RootState } from 'ducks/types';
import { fetchDebtStatusRequest } from 'ducks/debtStatus';
import { getCurrentWallet } from 'ducks/wallet';

import snxJSConnector from 'helpers/snxJSConnector';
import {
	ISSUANCE_EVENTS,
	FEEPOOL_EVENTS,
	EXCHANGE_EVENTS,
	TRANSFER_EVENTS,
} from 'constants/events';

type StateProps = {
	currentWallet: string;
};

type DispatchProps = {
	fetchDebtStatusRequest: typeof fetchDebtStatusRequest;
};

type GlobalEventsGateProps = StateProps & DispatchProps;

const GlobalEventsGate: FC<GlobalEventsGateProps> = ({ fetchDebtStatusRequest, currentWallet }) => {
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
	return null;
};

const mapStateToProps = (state: RootState): StateProps => {
	return {
		currentWallet: getCurrentWallet(state),
	};
};

const mapDispatchToProps: DispatchProps = {
	fetchDebtStatusRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(GlobalEventsGate);
