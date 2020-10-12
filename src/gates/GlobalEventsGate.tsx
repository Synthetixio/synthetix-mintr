import { useEffect, FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from 'ducks/types';
import { fetchDebtStatusRequest } from 'ducks/debtStatus';
import { getCurrentWallet } from 'ducks/wallet';
import { setSystemUpgrading } from 'ducks/app';
import { fetchRatesRequest } from 'ducks/rates';
import { fetchEscrowRequest } from 'ducks/escrow';
import { fetchBalancesRequest } from 'ducks/balances';

import snxJSConnector from 'helpers/snxJSConnector';
import {
	ISSUANCE_EVENTS,
	FEEPOOL_EVENTS,
	EXCHANGE_EVENTS,
	TRANSFER_EVENTS,
	SYSTEM_STATUS_EVENTS,
	EXCHANGE_RATES_EVENTS,
	REWARD_ESCROW_EVENTS,
	SYNTHETIX_ESCROW_EVENTS,
} from 'constants/events';

const mapStateToProps = (state: RootState) => ({
	currentWallet: getCurrentWallet(state),
});

const mapDispatchToProps = {
	fetchDebtStatusRequest,
	setSystemUpgrading,
	fetchEscrowRequest,
	fetchBalancesRequest,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const GlobalEventsGate: FC<PropsFromRedux> = ({
	fetchDebtStatusRequest,
	currentWallet,
	setSystemUpgrading,
	fetchEscrowRequest,
	fetchBalancesRequest,
}) => {
	useEffect(() => {
		if (!currentWallet) return;
		// const {
		// 	//@ts-ignore
		// 	snxJS: { sUSD, FeePool, Synthetix, RewardEscrow, SynthetixEscrow },
		// } = snxJSConnector;

		// Synthetix.contract.on(EXCHANGE_EVENTS.SYNTH_EXCHANGE, (address: string) => {
		// 	if (address === currentWallet) {
		// 		fetchBalancesRequest();
		// 		fetchDebtStatusRequest();
		// 	}
		// });
		// Synthetix.contract.on(TRANSFER_EVENTS.TRANSFER, (address: string) => {
		// 	if (address === currentWallet) {
		// 		fetchBalancesRequest();
		// 		fetchDebtStatusRequest();
		// 	}
		// });
		// sUSD.contract.on(TRANSFER_EVENTS.TRANSFER, (address: string) => {
		// 	if (address === currentWallet) {
		// 		fetchBalancesRequest();
		// 		fetchDebtStatusRequest();
		// 	}
		// });
		// SynthetixEscrow.contract.on(SYNTHETIX_ESCROW_EVENTS.VESTED, (address: string) => {
		// 	if (address === currentWallet) {
		// 		fetchEscrowRequest();
		// 	}
		// });
		// RewardEscrow.contract.on(REWARD_ESCROW_EVENTS.VESTED, (address: string) => {
		// 	if (address === currentWallet) {
		// 		fetchEscrowRequest();
		// 	}
		// });

		// return () => {
		// Object.values(ISSUANCE_EVENTS).forEach(event => sUSD.contract.removeAllListeners(event));
		// Object.values(FEEPOOL_EVENTS).forEach(event => FeePool.contract.removeAllListeners(event));
		// Object.values(EXCHANGE_EVENTS).forEach(event => Synthetix.contract.removeAllListeners(event));
		// Object.values(TRANSFER_EVENTS).forEach(event => Synthetix.contract.removeAllListeners(event));
		// Object.values(TRANSFER_EVENTS).forEach(event => sUSD.contract.removeAllListeners(event));
		// Object.values(SYNTHETIX_ESCROW_EVENTS).forEach(event =>
		// 	SynthetixEscrow.contract.removeAllListeners(event)
		// );
		// Object.values(REWARD_ESCROW_EVENTS).forEach(event =>
		// 	RewardEscrow.contract.removeAllListeners(event)
		// );
		// };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet]);

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
