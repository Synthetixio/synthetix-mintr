import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import snxJSConnector from '../../../../helpers/snxJSConnector';

import { bigNumberFormatter, formatCurrency } from '../../../../helpers/formatters';
import TransactionPriceIndicator from '../../../../components/TransactionPriceIndicator';
import { getWalletDetails } from '../../../../ducks/wallet';

import { PageTitle, PLarge, ButtonTertiaryLabel } from '../../../../components/Typography';
import DataBox from '../../../../components/DataBox';
import { ButtonTertiary, ButtonPrimary } from '../../../../components/Button';

import UnipoolActions from '../../../UnipoolActions';

const TRANSACTION_DETAILS = {
	stake: {
		contractFunction: 'stake',
		gasLimit: 200000,
	},
	claim: {
		contractFunction: 'getReward',
		gasLimit: 800000,
	},
	unstake: {
		contractFunction: 'withdraw',
		gasLimit: 125000,
	},
	exit: {
		contractFunction: 'exit',
		gasLimit: 925000,
	},
};

const Stake = ({ walletDetails, goBack }) => {
	const { t } = useTranslation();
	const { unipoolSXAUContract } = snxJSConnector;
	const [balances, setBalances] = useState(null);
	const [gasLimit, setGasLimit] = useState(TRANSACTION_DETAILS.stake.gasLimit);
	const [currentScenario, setCurrentScenario] = useState({});
	const { currentWallet } = walletDetails;

	const fetchData = useCallback(async () => {
		if (!snxJSConnector.initialized) return;
		try {
			const { uniswapV2Contract, unipoolSXAUContract } = snxJSConnector;
			const [univ2Held, univ2Staked, rewards] = await Promise.all([
				uniswapV2Contract.balanceOf(currentWallet),
				unipoolSXAUContract.balanceOf(currentWallet),
				unipoolSXAUContract.earned(currentWallet),
			]);
			setBalances({
				univ2Held: bigNumberFormatter(univ2Held),
				univ2HeldBN: univ2Held,
				univ2Staked: bigNumberFormatter(univ2Staked),
				univ2StakedBN: univ2Staked,
				rewards: bigNumberFormatter(rewards),
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
		const { unipoolSXAUContract } = snxJSConnector;

		unipoolSXAUContract.on('Staked', user => {
			if (user === currentWallet) {
				fetchData();
			}
		});

		unipoolSXAUContract.on('Withdrawn', user => {
			if (user === currentWallet) {
				fetchData();
			}
		});

		unipoolSXAUContract.on('RewardPaid', user => {
			if (user === currentWallet) {
				fetchData();
			}
		});

		return () => {
			if (snxJSConnector.initialized) {
				unipoolSXAUContract.removeAllListeners('Staked');
				unipoolSXAUContract.removeAllListeners('Withdrawn');
				unipoolSXAUContract.removeAllListeners('RewardPaid');
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet]);

	return (
		<Container>
			<UnipoolActions {...currentScenario} onDestroy={() => setCurrentScenario({})} />
			<Navigation>
				<ButtonTertiary onClick={goBack}>{t('button.navigation.back')}</ButtonTertiary>
				<ButtonTertiary
					as="a"
					target="_blank"
					href={`https://etherscan.io/address/${unipoolSXAUContract.address}`}
				>
					{t('lpRewards.shared.buttons.goToContract')} ↗
				</ButtonTertiary>
			</Navigation>
			<PageTitle>{t('unipoolSXAU.title')}</PageTitle>
			<PLarge>{t('unipoolSXAU.unlocked.subtitle')}</PLarge>
			<PLarge>
				<Link href="https://blog.synthetix.io/uniswap-v2-sxau-trial/" target="_blank">
					<ButtonTertiaryLabel>{t('lpRewards.shared.unlocked.link')}</ButtonTertiaryLabel>
				</Link>
			</PLarge>
			<BoxRow>
				<DataBox
					heading={t('lpRewards.shared.data.balance')}
					body={`${balances ? formatCurrency(balances.univ2Held, 10) : 0} UNI-V2`}
				/>
				<DataBox
					heading={t('lpRewards.shared.data.staked')}
					body={`${balances ? formatCurrency(balances.univ2Staked, 10) : 0} UNI-V2`}
				/>
				<DataBox
					heading={t('lpRewards.shared.data.rewardsAvailable')}
					body={`${balances ? formatCurrency(balances.rewards) : 0} SNX`}
				/>
			</BoxRow>
			<ButtonBlock>
				<ButtonRow>
					<ButtonAction
						onMouseEnter={() => setGasLimit(TRANSACTION_DETAILS['stake'].gasLimit)}
						disabled={!balances || !balances.univ2Held}
						onClick={() =>
							setCurrentScenario({
								contract: 'unipoolSXAUContract',
								action: 'stake',
								label: t('lpRewards.shared.actions.staking'),
								amount: `${balances && formatCurrency(balances.univ2Held, 10)} UNI-V2`,
								param: balances && balances.univ2HeldBN,
								...TRANSACTION_DETAILS['stake'],
							})
						}
					>
						{t('lpRewards.shared.buttons.stake')}
					</ButtonAction>
					<ButtonAction
						onMouseEnter={() => setGasLimit(TRANSACTION_DETAILS['claim'].gasLimit)}
						disabled={!balances || !balances.rewards}
						onClick={() =>
							setCurrentScenario({
								contract: 'unipoolSXAUContract',
								action: 'claim',
								label: t('lpRewards.shared.actions.claiming'),
								amount: `${balances && formatCurrency(balances.rewards)} SNX`,
								...TRANSACTION_DETAILS['claim'],
							})
						}
					>
						{t('lpRewards.shared.buttons.claim')}
					</ButtonAction>
				</ButtonRow>
				<ButtonRow>
					<ButtonAction
						onMouseEnter={() => setGasLimit(TRANSACTION_DETAILS['unstake'].gasLimit)}
						disabled={!balances || !balances.univ2Staked}
						onClick={() =>
							setCurrentScenario({
								contract: 'unipoolSXAUContract',
								action: 'unstake',
								label: t('lpRewards.shared.actions.unstaking'),
								amount: `${balances && formatCurrency(balances.univ2Staked, 10)} UNI-V2`,
								param: balances && balances.univ2StakedBN,
								...TRANSACTION_DETAILS['unstake'],
							})
						}
					>
						{t('lpRewards.shared.buttons.unstake')}
					</ButtonAction>
					<ButtonAction
						onMouseEnter={() => setGasLimit(TRANSACTION_DETAILS['exit'].gasLimit)}
						disabled={!balances || (!balances.univ2Staked && !balances.rewards)}
						onClick={() =>
							setCurrentScenario({
								contract: 'unipoolSXAUContract',
								action: 'exit',
								label: t('lpRewards.shared.actions.exiting'),
								amount: `${balances && formatCurrency(balances.univ2Staked, 10)} UNI-V2 & ${
									balances && formatCurrency(balances.rewards)
								} SNX`,
								...TRANSACTION_DETAILS['exit'],
							})
						}
					>
						{t('lpRewards.shared.buttons.exit')}
					</ButtonAction>
				</ButtonRow>
			</ButtonBlock>
			<TransactionPriceIndicator gasLimit={gasLimit} canEdit={true} />
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
	margin-bottom: 28px;
`;

const ButtonAction = styled(ButtonPrimary)`
	flex: 1;
	width: 10px;
	height: 64px;
	&:first-child {
		margin-right: 34px;
	}
`;

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Stake);
