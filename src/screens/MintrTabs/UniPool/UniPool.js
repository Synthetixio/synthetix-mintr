import React, { useState, useCallback, useEffect, useContext } from 'react';
import styled from 'styled-components';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { Store } from '../../../store';

import { GWEI_UNIT } from '../../../helpers/networkHelper';
import { bigNumberFormatter, formatCurrency } from '../../../helpers/formatters';
import { ButtonPrimary } from '../../../components/Button';
import PageContainer from '../../../components/PageContainer';

const ALLOWANCE_LIMIT = 100000000;

const UniPool = () => {
	const [hasAllowance, setAllowance] = useState(false);
	const [balances, setBalances] = useState(null);
	const [withdrawAmount, setWithdrawAmount] = useState('');
	const [error, setError] = useState(null);
	const [transactionHash, setTransactionHash] = useState(null);
	const {
		state: {
			wallet: { currentWallet },
			network: {
				settings: { gasPrice },
			},
		},
	} = useContext(Store);

	const fetchAllowance = useCallback(async () => {
		if (!snxJSConnector.initialized) return;
		try {
			const { uniswapContract, unipoolContract } = snxJSConnector;
			const allowance = await uniswapContract.allowance(currentWallet, unipoolContract.address);
			setAllowance(bigNumberFormatter(allowance));
		} catch (e) {
			console.log(e);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet, snxJSConnector.initialized]);

	const fetchData = useCallback(async () => {
		if (!snxJSConnector.initialized) return;
		try {
			const { uniswapContract, unipoolContract } = snxJSConnector;
			const [univ1Held, univ1Staked, rewards] = await Promise.all([
				uniswapContract.balanceOf(currentWallet),
				unipoolContract.balanceOf(currentWallet),
				unipoolContract.earned(currentWallet),
			]);
			setBalances({
				univ1Held: bigNumberFormatter(univ1Held),
				univ1HeldBN: univ1Held,
				univ1Staked: bigNumberFormatter(univ1Staked),
				univ1StakedBN: univ1Staked,
				rewards: bigNumberFormatter(rewards),
			});
		} catch (e) {
			console.log(e);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet, snxJSConnector.initialized]);

	useEffect(() => {
		fetchAllowance();
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchAllowance]);

	useEffect(() => {
		if (!currentWallet) return;
		const { uniswapContract, unipoolContract } = snxJSConnector;
		console.log(uniswapContract.removeAllListeners);
		uniswapContract.on('Approval', (owner, spender) => {
			if (owner === currentWallet && spender === unipoolContract.address) {
				fetchAllowance();
			}
		});
		return () => {
			if (snxJSConnector.initialized) {
				uniswapContract.removeAllListeners('Approval');
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet]);

	const onUnlock = async () => {
		const { parseEther } = snxJSConnector.utils;
		const { uniswapContract, unipoolContract } = snxJSConnector;
		try {
			setError(null);
			setTransactionHash(null);
			const gasEstimate = await uniswapContract.estimate.approve(
				unipoolContract.address,
				parseEther(ALLOWANCE_LIMIT.toString())
			);
			const transaction = await uniswapContract.approve(
				unipoolContract.address,
				parseEther(ALLOWANCE_LIMIT.toString()),
				{
					gasLimit: Number(gasEstimate) + 10000,
					gasPrice: gasPrice * GWEI_UNIT,
				}
			);
			if (transaction) {
				setTransactionHash(transaction.hash);
			}
		} catch (e) {
			setError(e.message);
			console.log(e);
		}
	};

	const onStake = async () => {
		const { unipoolContract } = snxJSConnector;
		try {
			setError(null);
			setTransactionHash(null);
			if (!balances || !balances.univ1HeldBN) return;
			const gasEstimate = await unipoolContract.estimate.stake(balances.univ1HeldBN);
			const transaction = await unipoolContract.stake(balances.univ1HeldBN, {
				gasLimit: Number(gasEstimate) + 10000,
				gasPrice: gasPrice * GWEI_UNIT,
			});
			if (transaction) {
				setTransactionHash(transaction.hash);
			}
		} catch (e) {
			setError(e.message);
			console.log(e);
		}
	};

	const onWithdraw = async () => {
		const { parseEther } = snxJSConnector.utils;
		const { unipoolContract } = snxJSConnector;
		try {
			if (!withdrawAmount) return;
			setError(null);
			setTransactionHash(null);
			const gasEstimate = await unipoolContract.estimate.withdraw(
				parseEther(withdrawAmount.toString())
			);
			const transaction = await unipoolContract.withdraw(parseEther(withdrawAmount.toString()), {
				gasLimit: Number(gasEstimate) + 10000,
				gasPrice: gasPrice * GWEI_UNIT,
			});
			if (transaction) {
				setTransactionHash(transaction.hash);
			}
		} catch (e) {
			setError(e.message);
			console.log(e);
		}
	};

	const onGetReward = async () => {
		const { unipoolContract } = snxJSConnector;
		try {
			setError(null);
			setTransactionHash(null);
			const gasEstimate = await unipoolContract.estimate.getReward();
			const transaction = await unipoolContract.getReward({
				gasLimit: Number(gasEstimate) + 10000,
				gasPrice: gasPrice * GWEI_UNIT,
			});
			if (transaction) {
				setTransactionHash(transaction.hash);
			}
		} catch (e) {
			setError(e.message);
			console.log(e);
		}
	};

	const onExit = async () => {
		const { unipoolContract } = snxJSConnector;
		try {
			setError(null);
			setTransactionHash(null);
			const gasEstimate = await unipoolContract.estimate.exit();
			const transaction = await unipoolContract.exit({
				gasLimit: Number(gasEstimate) + 10000,
				gasPrice: gasPrice * GWEI_UNIT,
			});
			if (transaction) {
				setTransactionHash(transaction.hash);
			}
		} catch (e) {
			setError(e.message);
			console.log(e);
		}
	};

	return (
		<PageContainer>
			<Inner>
				{!hasAllowance ? (
					<ButtonRow>
						<Left>
							<Label>Set token allowance first</Label>
						</Left>
						<ButtonPrimary onClick={onUnlock}>Unlock</ButtonPrimary>
					</ButtonRow>
				) : (
					<>
						<Data>
							<Label>
								Balance:{' '}
								{balances && balances.univ1Staked ? formatCurrency(balances.univ1Staked) : 0} UNI-V1
							</Label>
							<Label style={{ marginTop: '10px' }}>
								Rewards available:{' '}
								{balances && balances.rewards ? formatCurrency(balances.rewards) : 0} SNX
							</Label>
							<Link
								href="https://etherscan.io/address/0x48D7f315feDcaD332F68aafa017c7C158BC54760"
								target="_blank"
							>
								<Label style={{ marginTop: '10px' }}>Go to contract</Label>
							</Link>
						</Data>
						<ButtonRow>
							<Left />
							<ButtonPrimary onClick={onStake}>Stake all</ButtonPrimary>
						</ButtonRow>
						<ButtonRow>
							<Left />
							<ButtonPrimary onClick={onGetReward}>Get Rewards</ButtonPrimary>
						</ButtonRow>
						<ButtonRow>
							<Left>
								<Input
									type="number"
									placeholder="enter an amount"
									onChange={e => setWithdrawAmount(e.target.value)}
								/>
							</Left>
							<ButtonPrimary onClick={onWithdraw}>Withdraw</ButtonPrimary>
						</ButtonRow>
						<ButtonRow>
							<Left />
							<ButtonPrimary onClick={onExit}>Exit</ButtonPrimary>
						</ButtonRow>
					</>
				)}
				{error ? <Error>{`Error: ${error}`}</Error> : null}
				{transactionHash ? (
					<Link target="_blank" href={`https://etherscan.io/tx/${transactionHash}`}>
						<Label>{`https://etherscan.io/tx/${transactionHash}`}</Label>
					</Link>
				) : null}
			</Inner>
		</PageContainer>
	);
};

const Input = styled.input`
	height: 72px;
	width: 150px;
	padding: 0 10px;
	border-radius: 5px;
	border: 1px solid ${props => props.theme.colorStyles.borders};
	font-size: 14px;
	font-family: 'apercu-medium', sans-serif;
	color: ${props => props.theme.colorStyles.body};
`;

const Left = styled.div`
	width: 150px;
`;

const Data = styled.div`
	margin-bottom: 40px;
`;

const Inner = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	justify-content: center;
`;

const ButtonRow = styled.div`
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: center;
	margin-top: 20px;
	& > button {
		margin-left: 40px;
	}
`;

const Label = styled.div`
	font-size: 16px;
	font-family: 'apercu-medium', sans-serif;
	color: ${props => props.theme.colorStyles.body};
`;

const Error = styled(Label)`
	color: ${props => props.theme.colorStyles.brandRed};
	display: flex;
	justify-content: center;
	margin-top: 40px;
`;

const Link = styled.a`
	margin-top: 40px;
`;

export default UniPool;
