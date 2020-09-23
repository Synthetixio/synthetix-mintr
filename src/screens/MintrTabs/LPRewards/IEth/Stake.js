import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import snxJSConnector from '../../../../helpers/snxJSConnector';

import {
	bigNumberFormatter,
	formatCurrency,
	bytesFormatter,
	parseBytes32String,
} from '../../../../helpers/formatters';
import TransactionPriceIndicator from '../../../../components/TransactionPriceIndicator';
import { getWalletDetails } from '../../../../ducks/wallet';

import { PageTitle, PLarge, ButtonTertiaryLabel } from '../../../../components/Typography';
import DataBox from '../../../../components/DataBox';
import { ButtonTertiary, ButtonPrimary } from '../../../../components/Button';

import IEthActions from '../../../IEthActions';

const DEFAULT_GAS_LIMIT = 300000;

const Stake = ({ walletDetails, goBack }) => {
	const { t } = useTranslation();
	const [balances, setBalances] = useState(null);
	const [currentScenario, setCurrentScenario] = useState({});
	const { currentWallet } = walletDetails;
	const {
		iEth4RewardsContract,
		iEth2RewardsContract,
		snxJS: { Exchanger, Synthetix },
	} = snxJSConnector;

	const fetchData = useCallback(async () => {
		if (!snxJSConnector.initialized) return;
		try {
			const {
				snxJS: { iETH, Exchanger },
				iEth4RewardsContract,
			} = snxJSConnector;
			const [
				iETHBalance,
				iETHStaked,
				rewards,
				settlementOwing,
				rewardsOld,
				stakedOld,
			] = await Promise.all([
				iETH.balanceOf(currentWallet),
				iEth4RewardsContract.balanceOf(currentWallet),
				iEth4RewardsContract.earned(currentWallet),
				Exchanger.settlementOwing(currentWallet, bytesFormatter('iETH')),
				iEth2RewardsContract.earned(currentWallet),
				iEth2RewardsContract.balanceOf(currentWallet),
			]);

			const reclaimAmount = Number(settlementOwing.reclaimAmount);
			const rebateAmount = Number(settlementOwing.rebateAmount);

			setBalances({
				iETHBalance: bigNumberFormatter(iETHBalance),
				iETHBalanceBN: iETHBalance,
				iETHStaked: bigNumberFormatter(iETHStaked),
				iETHStakedBN: iETHStaked,
				rewards: bigNumberFormatter(rewards),
				rewardsOld: bigNumberFormatter(rewardsOld),
				needsToSettle: reclaimAmount || rebateAmount,
				stakedOld: bigNumberFormatter(stakedOld),
			});
		} catch (e) {
			console.log(e);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet, snxJSConnector.initialized]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	useEffect(() => {
		if (!currentWallet) return;
		const { iEth4RewardsContract } = snxJSConnector;

		iEth4RewardsContract.on('Staked', user => {
			if (user === currentWallet) {
				fetchData();
			}
		});

		iEth4RewardsContract.on('Withdrawn', user => {
			if (user === currentWallet) {
				fetchData();
			}
		});

		iEth2RewardsContract.on('RewardPaid', user => {
			if (user === currentWallet) {
				fetchData();
			}
		});

		iEth4RewardsContract.on('RewardPaid', user => {
			if (user === currentWallet) {
				fetchData();
			}
		});

		Synthetix.contract.on('ExchangeReclaim', (account, currencyKey) => {
			if (account === currentWallet && parseBytes32String(currencyKey) === 'iETH') {
				fetchData();
			}
		});

		Synthetix.contract.on('ExchangeRebate', (account, currencyKey) => {
			if (account === currentWallet && parseBytes32String(currencyKey) === 'iETH') {
				fetchData();
			}
		});

		return () => {
			if (snxJSConnector.initialized) {
				iEth4RewardsContract.removeAllListeners('Staked');
				iEth4RewardsContract.removeAllListeners('Withdrawn');
				iEth2RewardsContract.removeAllListeners('Withdrawn');
				iEth4RewardsContract.removeAllListeners('RewardPaid');
				Synthetix.contract.removeAllListeners('ExchangeReclaim');
				Synthetix.contract.removeAllListeners('ExchangeRebate');
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet]);

	return (
		<Container>
			<IEthActions {...currentScenario} onDestroy={() => setCurrentScenario({})} />
			<Navigation>
				<ButtonTertiary onClick={goBack}>{t('button.navigation.back')}</ButtonTertiary>
				<ButtonTertiary
					as="a"
					target="_blank"
					href={`https://etherscan.io/address/${iEth4RewardsContract.address}`}
				>
					{t('lpRewards.shared.buttons.goToContract')} ↗
				</ButtonTertiary>
			</Navigation>
			<PageTitle>{t('ieth.title')}</PageTitle>
			<PLarge>{t('ieth.unlocked.subtitle')}</PLarge>
			<PLarge>
				<Link href="https://blog.synthetix.io/neutral-debt-pool-incentive-trial/" target="_blank">
					<ButtonTertiaryLabel>{t('lpRewards.shared.unlocked.link')}</ButtonTertiaryLabel>
				</Link>
			</PLarge>
			<BoxRow>
				<DataBox
					heading={t('lpRewards.shared.data.balance')}
					body={`${balances ? formatCurrency(balances.iETHBalance) : 0} iETH`}
				/>
				<DataBox
					heading={t('lpRewards.shared.data.staked')}
					body={`${balances ? formatCurrency(balances.iETHStaked) : 0} iETH`}
				/>
				<DataBox
					heading={t('lpRewards.shared.data.rewardsAvailable')}
					body={`${balances ? formatCurrency(balances.rewards) : 0} SNX`}
				/>
				{balances && balances.rewardsOld ? (
					<DataBox
						heading={t('lpRewards.shared.data.rewardsAvailableOldContract')}
						body={`${formatCurrency(balances.rewardsOld)} SNX`}
					/>
				) : null}
			</BoxRow>
			<ButtonBlock>
				<ButtonRow>
					<ButtonAction
						disabled={!balances || !balances.iETHBalance || balances.needsToSettle}
						onClick={() =>
							setCurrentScenario({
								action: 'stake',
								label: t('lpRewards.shared.actions.staking'),
								amount: `${balances && formatCurrency(balances.iETHBalance)} iETH`,
								contractFunction: transactionSettings =>
									iEth4RewardsContract.stake(
										balances && balances.iETHBalanceBN,
										transactionSettings
									),
								contractFunctionEstimate: () =>
									iEth4RewardsContract.estimate.stake(balances && balances.iETHBalanceBN),
							})
						}
					>
						{t('lpRewards.shared.buttons.stake')}
					</ButtonAction>
					<ButtonAction
						disabled={!balances || !balances.rewards}
						onClick={() =>
							setCurrentScenario({
								action: 'claim',
								label: t('lpRewards.shared.actions.claiming'),
								amount: `${balances && formatCurrency(balances.rewards)} SNX`,
								contractFunction: transactionSettings =>
									iEth4RewardsContract.getReward(transactionSettings),
								contractFunctionEstimate: () => iEth4RewardsContract.estimate.getReward(),
							})
						}
					>
						{t('lpRewards.shared.buttons.claim')}
					</ButtonAction>
				</ButtonRow>
				<ButtonRow>
					<ButtonAction
						disabled={!balances || !balances.iETHStaked}
						onClick={() =>
							setCurrentScenario({
								action: 'unstake',
								label: t('lpRewards.shared.actions.unstaking'),
								amount: `${balances && formatCurrency(balances.iETHStaked)} iETH`,
								param: balances && balances.iETHStakedBN,
								contractFunction: transactionSettings =>
									iEth4RewardsContract.withdraw(
										balances && balances.iETHStakedBN,
										transactionSettings
									),
								contractFunctionEstimate: () =>
									iEth4RewardsContract.estimate.withdraw(balances && balances.iETHStakedBN),
							})
						}
					>
						{t('lpRewards.shared.buttons.unstake')}
					</ButtonAction>
					<ButtonAction
						disabled={!balances || !balances.iETHStaked}
						onClick={() =>
							setCurrentScenario({
								action: 'exit',
								label: t('lpRewards.shared.actions.exiting'),
								amount: `${balances && formatCurrency(balances.iETHStaked)} iETH & ${
									balances && formatCurrency(balances.rewards)
								} SNX`,
								contractFunction: transactionSettings =>
									iEth4RewardsContract.exit(transactionSettings),
								contractFunctionEstimate: () => iEth4RewardsContract.estimate.exit(),
							})
						}
					>
						{t('lpRewards.shared.buttons.exit')}
					</ButtonAction>
				</ButtonRow>

				{balances && balances.stakedOld ? (
					<ButtonRow>
						<ButtonActionFullRow
							onClick={() =>
								setCurrentScenario({
									action: 'exit',
									label: t('lpRewards.shared.actions.claiming'),
									amount: `${balances && formatCurrency(balances.stakedOld)} iETH & ${
										balances && formatCurrency(balances.rewardsOld)
									} SNX`,
									contractFunction: transactionSettings =>
										iEth2RewardsContract.exit(transactionSettings),
									contractFunctionEstimate: () => iEth2RewardsContract.estimate.exit(),
								})
							}
						>
							{t('lpRewards.shared.buttons.exit-old')}
						</ButtonActionFullRow>
					</ButtonRow>
				) : null}

				{balances && balances.needsToSettle ? (
					<ButtonRowBottom>
						<PLarge>{t('ieth.unlocked.settle-info')}</PLarge>
						<ButtonActionFullRow
							onClick={() =>
								setCurrentScenario({
									action: 'settle',
									label: t('lpRewards.shared.actions.settling'),
									amount: 'iETH',
									contractFunction: transactionSettings =>
										Exchanger.settle(currentWallet, bytesFormatter('iETH'), transactionSettings),
									contractFunctionEstimate: () =>
										Exchanger.contract.estimate.settle(currentWallet, bytesFormatter('iETH')),
								})
							}
						>
							{t('lpRewards.shared.buttons.settle')}
						</ButtonActionFullRow>
					</ButtonRowBottom>
				) : null}
			</ButtonBlock>
			<TransactionPriceIndicator gasLimit={DEFAULT_GAS_LIMIT} canEdit={true} />
		</Container>
	);
};

const Link = styled.a`
	text-decoration-color: ${props => props.theme.colorStyles.buttonTertiaryText};
`;

const Container = styled.div`
	min-height: 850px;
`;

const Navigation = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 40px;
`;

const BoxRow = styled.div`
	margin-top: 42px;
	display: flex;
`;

const ButtonBlock = styled.div`
	margin-top: 58px;
`;

const ButtonRow = styled.div`
	display: flex;
	justify-content: center;
	margin-bottom: 28px;
	width: 100%;
`;

const ButtonAction = styled(ButtonPrimary)`
	flex: 1;
	width: 10px;
	height: 64px;
	&:first-child {
		margin-right: 34px;
	}
`;

const ButtonActionFullRow = styled(ButtonAction)`
	flex: none;
	width: 50%;
`;

const ButtonRowBottom = styled(ButtonRow)`
	flex-direction: column;
	align-items: center;
	margin-top: 50px;
`;

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Stake);
