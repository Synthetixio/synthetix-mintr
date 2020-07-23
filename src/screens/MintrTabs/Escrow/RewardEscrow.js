import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { addBufferToGasLimit } from '../../../helpers/networkHelper';
import { bigNumberFormatter } from '../../../helpers/formatters';

import { PageTitle, PLarge } from '../../../components/Typography';
import { ButtonPrimary, ButtonSecondary } from '../../../components/Button';

import { getWalletDetails } from '../../../ducks/wallet';

import ErrorMessage from '../../../components/ErrorMessage';
import EscrowActions from '../../EscrowActions';
import TransactionPriceIndicator from '../../../components/TransactionPriceIndicator';
import ScheduleTable from './ScheduleTable';

const RewardEscrow = ({ onPageChange, walletDetails: { currentWallet } }) => {
	const { t } = useTranslation();
	const [currentScenario, setCurrentScenario] = useState(null);
	const [isFetchingGasLimit, setFetchingGasLimit] = useState(false);
	const [vestingData, setVestingData] = useState({});
	const [gasLimit, setGasLimit] = useState(0);
	const [error, setError] = useState(null);

	const hasNoVestingSchedule = !vestingData.totalEscrowed || vestingData.totalEscrowed.length === 0;

	const fetchVestingData = useCallback(async () => {
		if (!currentWallet) return;
		const {
			snxJS: { RewardEscrow },
		} = snxJSConnector;
		try {
			let schedule = [];

			let canVest = 0;
			const currentUnixTime = new Date().getTime();

			setVestingData({ loading: true });

			const [accountSchedule, totalEscrowed, totalVested] = await Promise.all([
				RewardEscrow.checkAccountSchedule(currentWallet),
				RewardEscrow.totalEscrowedAccountBalance(currentWallet),
				RewardEscrow.totalVestedAccountBalance(currentWallet),
			]);
			for (let i = 0; i < accountSchedule.length; i += 2) {
				const quantity = Number(bigNumberFormatter(accountSchedule[i + 1]));

				if (!accountSchedule[i].isZero() && quantity) {
					if (accountSchedule[i] * 1000 < currentUnixTime) {
						canVest += quantity;
					}
					schedule.push({
						date: new Date(Number(accountSchedule[i]) * 1000),
						quantity,
					});
				}
			}

			setVestingData({
				schedule,
				loading: false,
				canVest,
				totalEscrowed: bigNumberFormatter(totalEscrowed),
				totalVested: bigNumberFormatter(totalVested),
			});
		} catch (e) {
			console.log(e);
			setVestingData({ loading: false });
		}
	}, [currentWallet]);

	const fetchGasLimit = useCallback(async () => {
		setError(null);
		setFetchingGasLimit(true);
		const {
			snxJS: { RewardEscrow },
		} = snxJSConnector;
		try {
			const gasEstimate = await RewardEscrow.contract.estimate.vest();
			setFetchingGasLimit(false);
			setGasLimit(addBufferToGasLimit(gasEstimate));
		} catch (e) {
			console.log(e);
			setFetchingGasLimit(false);
			const errorMessage = (e && e.message) || 'error.type.gasEstimate';
			setError(errorMessage);
		}
	}, []);

	useEffect(() => {
		fetchVestingData();
		fetchGasLimit();
	}, [fetchVestingData, fetchGasLimit]);

	useEffect(() => {
		if (!currentWallet) return;
		const {
			snxJS: { RewardEscrow },
		} = snxJSConnector;

		RewardEscrow.contract.on('Vested', beneficiary => {
			if (currentWallet === beneficiary) {
				fetchVestingData();
				fetchGasLimit();
			}
		});
		return () => {
			if (snxJSConnector.initialized) {
				RewardEscrow.contract.removeAllListeners('Vested');
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet]);

	return (
		<Fragment>
			<EscrowActions
				action={currentScenario}
				onDestroy={() => setCurrentScenario(null)}
				vestAmount={vestingData.canVest}
				gasLimit={gasLimit}
				isFetchingGasLimit={isFetchingGasLimit}
			/>

			<PageTitle>{t('escrow.staking.title')}</PageTitle>
			<PLarge>{t('escrow.staking.subtitle')}</PLarge>
			<ScheduleTable {...vestingData} />

			<TransactionPriceIndicator gasLimit={gasLimit} isFetchingGasLimit={isFetchingGasLimit} />

			<ErrorMessage message={t(error)} />
			<ButtonRow>
				<ButtonSecondary width="48%" onClick={() => onPageChange('tokenSaleVesting')}>
					{t('escrow.buttons.viewTokenSale')}
				</ButtonSecondary>
				<ButtonPrimary
					disabled={hasNoVestingSchedule || error || !vestingData.canVest}
					onClick={() => setCurrentScenario('rewardsVesting')}
					width="48%"
				>
					{t('escrow.buttons.vest')}
				</ButtonPrimary>
			</ButtonRow>
		</Fragment>
	);
};

const ButtonRow = styled.div`
	margin-top: 40px;
	display: flex;
	width: 100%;
	justify-content: space-between;
`;

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(RewardEscrow);
