import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { addBufferToGasLimit } from '../../../helpers/networkHelper';

import { PageTitle, PLarge } from '../../../components/Typography';
import { ButtonPrimary } from '../../../components/Button';

import { getWalletDetails } from '../../../ducks/wallet';

import ErrorMessage from '../../../components/ErrorMessage';
import EscrowActions from '../../EscrowActions';
import TransactionPriceIndicator from '../../../components/TransactionPriceIndicator';
import ScheduleTable from './ScheduleTable';

const VESTING_ENTRIES_PAGINATION = 50;

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
			snxJS: { RewardEscrowV2 },
		} = snxJSConnector;

		try {
			setVestingData({ loading: true });

			const [numVestingEntries, totalEscrowed, totalVested] = await Promise.all([
				RewardEscrowV2.numVestingEntries(currentWallet),
				RewardEscrowV2.balanceOf(currentWallet),
				RewardEscrowV2.totalVestedAccountBalance(currentWallet),
			]);

			let vestingEntriesPromise = [];
			let vestingEntriesIdPromise = [];
			const totalVestingEntries = Number(numVestingEntries);

			for (let index = 0; index < totalVestingEntries; index += VESTING_ENTRIES_PAGINATION) {
				const pagination =
					index + VESTING_ENTRIES_PAGINATION > totalVestingEntries
						? totalVestingEntries - index
						: VESTING_ENTRIES_PAGINATION;
				vestingEntriesPromise.push(
					RewardEscrowV2.getVestingSchedules(currentWallet, index, pagination)
				);
				vestingEntriesIdPromise.push(
					RewardEscrowV2.getAccountVestingEntryIDs(currentWallet, index, pagination)
				);
			}

			const [[vestingEntries], [vestingEntriesId]] = await Promise.all([
				Promise.all(vestingEntriesPromise),
				Promise.all(vestingEntriesIdPromise),
			]);

			let claimableAmount = 0;

			if (vestingEntriesId != null) {
				claimableAmount = await RewardEscrowV2.getVestingQuantity(currentWallet, vestingEntriesId);
			}

			let schedule = [];
			let claimableEntryIds = [];

			(vestingEntries ?? []).forEach(({ escrowAmount, entryID, endTime }) => {
				const quantity = escrowAmount / 1e18;
				if (quantity) {
					claimableEntryIds.push(entryID);
					schedule.push({
						quantity,
						date: new Date(Number(endTime) * 1000),
					});
				}
			});

			setVestingData({
				schedule,
				loading: false,
				canVest: claimableAmount / 1e18,
				totalEscrowed: totalEscrowed / 1e18,
				totalVested: totalVested / 1e18,
				claimableEntryIds,
			});
		} catch (e) {
			console.log(e);
			setVestingData({ loading: false });
		}
	}, [currentWallet]);

	useEffect(() => {
		const fetchGasLimit = async () => {
			setError(null);
			setFetchingGasLimit(true);
			const {
				snxJS: { RewardEscrowV2 },
			} = snxJSConnector;
			try {
				if (vestingData && vestingData.claimableEntryIds) {
					const gasEstimate = await RewardEscrowV2.contract.estimate.vest(
						vestingData.claimableEntryIds
					);
					setFetchingGasLimit(false);
					setGasLimit(Number(gasEstimate));
				}
			} catch (e) {
				console.log(e);
				setFetchingGasLimit(false);
				const errorMessage = (e && e.message) || 'error.type.gasEstimate';
				setError(errorMessage);
			}
		};
		fetchGasLimit();
	}, [vestingData]);

	useEffect(() => {
		fetchVestingData();
	}, [fetchVestingData]);

	useEffect(() => {
		if (!currentWallet) return;
		const {
			snxJS: { RewardEscrowV2 },
		} = snxJSConnector;

		RewardEscrowV2.contract.on('Vested', beneficiary => {
			if (currentWallet === beneficiary) {
				fetchVestingData();
			}
		});
		return () => {
			if (snxJSConnector.initialized) {
				RewardEscrowV2.contract.removeAllListeners('Vested');
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
				entries={vestingData.claimableEntryIds}
				gasLimit={gasLimit}
				isFetchingGasLimit={isFetchingGasLimit}
			/>

			<PageTitle>{t('escrow.staking.title')}</PageTitle>
			<PLarge>{t('escrow.staking.subtitle')}</PLarge>
			<ScheduleTable {...vestingData} />

			<TransactionPriceIndicator gasLimit={gasLimit} isFetchingGasLimit={isFetchingGasLimit} />

			<ErrorMessage message={t(error)} />
			<ButtonRow>
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
	justify-content: center;
`;

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(RewardEscrow);
