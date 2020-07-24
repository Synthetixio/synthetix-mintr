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

import IBtcActions from '../../../IBtcActions';

const DEFAULT_GAS_LIMIT = 300000;

const Stake = ({ walletDetails, goBack }) => {
	const { t } = useTranslation();
	const [balances, setBalances] = useState(null);
	const [currentScenario, setCurrentScenario] = useState({});
	const { currentWallet } = walletDetails;
	const {
		iBtcRewardsContract,
		snxJS: { Exchanger, Synthetix },
	} = snxJSConnector;

	const fetchData = useCallback(async () => {
		if (!snxJSConnector.initialized) return;
		try {
			const {
				snxJS: { iBTC, Exchanger },
				iBtcRewardsContract,
			} = snxJSConnector;
			const [iBTCBalance, iBTCStaked, rewards, settlementOwing] = await Promise.all([
				iBTC.balanceOf(currentWallet),
				iBtcRewardsContract.balanceOf(currentWallet),
				iBtcRewardsContract.earned(currentWallet),
				Exchanger.settlementOwing(currentWallet, bytesFormatter('iBTC')),
			]);

			const reclaimAmount = Number(settlementOwing.reclaimAmount);
			const rebateAmount = Number(settlementOwing.rebateAmount);

			setBalances({
				iBTCBalance: bigNumberFormatter(iBTCBalance),
				iBTCBalanceBN: iBTCBalance,
				iBTCStaked: bigNumberFormatter(iBTCStaked),
				iBTCStakedBN: iBTCStaked,
				rewards: bigNumberFormatter(rewards),
				needsToSettle: reclaimAmount || rebateAmount,
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
		const { iBtcRewardsContract } = snxJSConnector;

		iBtcRewardsContract.on('Staked', user => {
			if (user === currentWallet) {
				fetchData();
			}
		});

		iBtcRewardsContract.on('Withdrawn', user => {
			if (user === currentWallet) {
				fetchData();
			}
		});

		iBtcRewardsContract.on('RewardPaid', user => {
			if (user === currentWallet) {
				fetchData();
			}
		});

		Synthetix.contract.on('ExchangeReclaim', (account, currencyKey) => {
			if (account === currentWallet && parseBytes32String(currencyKey) === 'iBTC') {
				fetchData();
			}
		});

		Synthetix.contract.on('ExchangeRebate', (account, currencyKey) => {
			if (account === currentWallet && parseBytes32String(currencyKey) === 'iBTC') {
				fetchData();
			}
		});

		return () => {
			if (snxJSConnector.initialized) {
				iBtcRewardsContract.removeAllListeners('Staked');
				iBtcRewardsContract.removeAllListeners('Withdrawn');
				iBtcRewardsContract.removeAllListeners('RewardPaid');
				Synthetix.contract.removeAllListeners('ExchangeReclaim');
				Synthetix.contract.removeAllListeners('ExchangeRebate');
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet]);

	return (
		<Container>
			<IBtcActions {...currentScenario} onDestroy={() => setCurrentScenario({})} />
			<Navigation>
				<ButtonTertiary onClick={goBack}>{t('button.navigation.back')}</ButtonTertiary>
				<ButtonTertiary
					as="a"
					target="_blank"
					href={`https://etherscan.io/address/${iBtcRewardsContract.address}`}
				>
					{t('lpRewards.shared.buttons.goToContract')} ↗
				</ButtonTertiary>
			</Navigation>
			<PageTitle>{t('ibtc.title')}</PageTitle>
			<PLarge>{t('ibtc.unlocked.subtitle')}</PLarge>
			<PLarge>
				<Link href="https://blog.synthetix.io/neutral-debt-pool-incentive-trial/" target="_blank">
					<ButtonTertiaryLabel>{t('lpRewards.shared.unlocked.link')}</ButtonTertiaryLabel>
				</Link>
			</PLarge>
			<BoxRow>
				<DataBox
					heading={t('lpRewards.shared.data.balance')}
					body={`${balances ? formatCurrency(balances.iBTCBalance) : 0} iBTC`}
				/>
				<DataBox
					heading={t('lpRewards.shared.data.staked')}
					body={`${balances ? formatCurrency(balances.iBTCStaked) : 0} iBTC`}
				/>
				<DataBox
					heading={t('lpRewards.shared.data.rewardsAvailable')}
					body={`${balances ? formatCurrency(balances.rewards) : 0} SNX`}
				/>
			</BoxRow>
			<ButtonBlock>
				<ButtonRow>
					<ButtonAction
						disabled={!balances || !balances.iBTCBalance || balances.needsToSettle}
						onClick={() =>
							setCurrentScenario({
								action: 'stake',
								label: t('lpRewards.shared.actions.staking'),
								amount: `${balances && formatCurrency(balances.iBTCBalance)} iBTC`,
								contractFunction: transactionSettings =>
									iBtcRewardsContract.stake(
										balances && balances.iBTCBalanceBN,
										transactionSettings
									),
								contractFunctionEstimate: () =>
									iBtcRewardsContract.estimate.stake(balances && balances.iBTCBalanceBN),
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
									iBtcRewardsContract.getReward(transactionSettings),
								contractFunctionEstimate: () => iBtcRewardsContract.estimate.getReward(),
							})
						}
					>
						{t('lpRewards.shared.buttons.claim')}
					</ButtonAction>
				</ButtonRow>
				<ButtonRow>
					<ButtonAction
						disabled={!balances || !balances.iBTCStaked}
						onClick={() =>
							setCurrentScenario({
								action: 'unstake',
								label: t('lpRewards.shared.actions.unstaking'),
								amount: `${balances && formatCurrency(balances.iBTCStaked)} iBTC`,
								param: balances && balances.iBTCStakedBN,
								contractFunction: transactionSettings =>
									iBtcRewardsContract.withdraw(
										balances && balances.iBTCStakedBN,
										transactionSettings
									),
								contractFunctionEstimate: () =>
									iBtcRewardsContract.estimate.withdraw(balances && balances.iBTCStakedBN),
							})
						}
					>
						{t('lpRewards.shared.buttons.unstake')}
					</ButtonAction>
					<ButtonAction
						disabled={!balances || !balances.iBTCStaked}
						onClick={() =>
							setCurrentScenario({
								action: 'exit',
								label: t('lpRewards.shared.actions.exiting'),
								amount: `${balances && formatCurrency(balances.iBTCStaked)} iBTC & ${
									balances && formatCurrency(balances.rewards)
								} SNX`,
								contractFunction: transactionSettings =>
									iBtcRewardsContract.exit(transactionSettings),
								contractFunctionEstimate: () => iBtcRewardsContract.estimate.exit(),
							})
						}
					>
						{t('lpRewards.shared.buttons.exit')}
					</ButtonAction>
				</ButtonRow>

				{balances && balances.needsToSettle ? (
					<ButtonRowBottom>
						<PLarge>{t('ibtc.unlocked.settle-info')}</PLarge>
						<ButtonActionFullRow
							onClick={() =>
								setCurrentScenario({
									action: 'settle',
									label: t('lpRewards.shared.actions.settling'),
									amount: 'iBTC',
									contractFunction: transactionSettings =>
										Exchanger.settle(currentWallet, bytesFormatter('iBTC'), transactionSettings),
									contractFunctionEstimate: () =>
										Exchanger.contract.estimate.settle(currentWallet, bytesFormatter('iBTC')),
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
	margin-top: 64px;
`;

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Stake);
