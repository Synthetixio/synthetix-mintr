import React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import snxJSConnector from '../../../helpers/snxJSConnector';

import { PageTitle, PLarge } from '../../../components/Typography';
import { ButtonTertiary } from '../../../components/Button';

const Stake = ({ t }) => {
	const { unipoolContract } = snxJSConnector;
	const unipoolContractAddress = unipoolContract.address;
	// const [balances, setBalances] = useState(null);
	// const [withdrawAmount, setWithdrawAmount] = useState('');
	// const fetchData = useCallback(async () => {
	// 	if (!snxJSConnector.initialized) return;
	// 	try {
	// 		const { uniswapContract, unipoolContract } = snxJSConnector;
	// 		const [univ1, rewards] = await Promise.all([
	// 			uniswapContract.balanceOf(currentWallet),
	// 			unipoolContract.rewards(currentWallet),
	// 		]);
	// 		setBalances({
	// 			univ1: bigNumberFormatter(univ1),
	// 			univ1BN: univ1,
	// 			rewards: bigNumberFormatter(rewards),
	// 		});
	// 	} catch (e) {
	// 		console.log(e);
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [currentWallet, snxJSConnector.initialized]);

	return (
		<>
			<Navigation>
				<ButtonTertiary
					as="a"
					target="_blank"
					href={`https://etherscan.io/address/${unipoolContractAddress}`}
				>
					{t('unipool.buttons.goToContract')} ↗
				</ButtonTertiary>
			</Navigation>
			<PageTitle>{t('unipool.unlocked.title')}</PageTitle>
			<PLarge>{t('unipool.unlocked.subtitle')}</PLarge>
		</>
	);
};

const Navigation = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-bottom: 40px;
`;

export default withTranslation()(Stake);

// const onStake = async () => {
// 	const { unipoolContract } = snxJSConnector;
// 	try {
// 		setError(null);
// 		setTransactionHash(null);
// 		if (!balances || !balances.univ1BN) return;
// 		const gasEstimate = await unipoolContract.estimate.stake(balances.univ1BN);
// 		const transaction = await unipoolContract.stake(balances.univ1BN, {
// 			gasLimit: Number(gasEstimate) + 10000,
// 			gasPrice: gasPrice * GWEI_UNIT,
// 		});
// 		if (transaction) {
// 			setTransactionHash(transaction.hash);
// 		}
// 	} catch (e) {
// 		setError(e.message);
// 		console.log(e);
// 	}
// };

// const onWithdraw = async () => {
// 	const { parseEther } = snxJSConnector.utils;
// 	const { unipoolContract } = snxJSConnector;
// 	try {
// 		if (!withdrawAmount) return;
// 		setError(null);
// 		setTransactionHash(null);
// 		const gasEstimate = await unipoolContract.estimate.withdraw(
// 			parseEther(withdrawAmount.toString())
// 		);
// 		const transaction = await unipoolContract.withdraw(parseEther(withdrawAmount.toString()), {
// 			gasLimit: Number(gasEstimate) + 10000,
// 			gasPrice: gasPrice * GWEI_UNIT,
// 		});
// 		if (transaction) {
// 			setTransactionHash(transaction.hash);
// 		}
// 	} catch (e) {
// 		setError(e.message);
// 		console.log(e);
// 	}
// };

// const onGetReward = async () => {
// 	const { unipoolContract } = snxJSConnector;
// 	try {
// 		setError(null);
// 		setTransactionHash(null);
// 		const gasEstimate = await unipoolContract.estimate.getReward();
// 		const transaction = await unipoolContract.getReward({
// 			gasLimit: Number(gasEstimate) + 10000,
// 			gasPrice: gasPrice * GWEI_UNIT,
// 		});
// 		if (transaction) {
// 			setTransactionHash(transaction.hash);
// 		}
// 	} catch (e) {
// 		setError(e.message);
// 		console.log(e);
// 	}
// };

// const onExit = async () => {
// 	const { unipoolContract } = snxJSConnector;
// 	try {
// 		setError(null);
// 		setTransactionHash(null);
// 		const gasEstimate = await unipoolContract.estimate.exit();
// 		const transaction = await unipoolContract.exit({
// 			gasLimit: Number(gasEstimate) + 10000,
// 			gasPrice: gasPrice * GWEI_UNIT,
// 		});
// 		if (transaction) {
// 			setTransactionHash(transaction.hash);
// 		}
// 	} catch (e) {
// 		setError(e.message);
// 		console.log(e);
// 	}
// };
