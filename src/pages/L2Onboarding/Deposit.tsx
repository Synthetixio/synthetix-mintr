import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { ReactComponent as SendIcon } from '../../assets/images/L2/send.svg';
import { Stepper } from '../../components/L2Onboarding/Stepper';
import { StatBox } from '../../components/L2Onboarding/StatBox';
import { HeaderIcon } from 'components/L2Onboarding/HeaderIcon';
import { getWalletDetails } from 'ducks/wallet';
import { connect } from 'react-redux';
import { getWalletBalances } from 'ducks/balances';
import { CTAButton } from 'components/L2Onboarding/component/CTAButton';
import GasIndicator from 'components/L2Onboarding/GasIndicator';
import ErrorMessage from '../../components/ErrorMessage';
import snxJSConnector from 'helpers/snxJSConnector';
import { TOKEN_ALLOWANCE_LIMIT } from 'constants/network';
import { getCurrentGasPrice } from 'ducks/network';
import { getEtherscanTxLink } from 'helpers/explorers';
import { addBufferToGasLimit } from 'helpers/networkHelper';
import { useTranslation } from 'react-i18next';
import { bigNumberFormatter } from 'helpers/formatters';
import errorMapper from 'helpers/errorMapper';
import Spinner from 'components/Spinner';

interface DepositProps {
	onComplete: Function;
	walletDetails: any;
	walletBalances: any;
	currentGasPrice: any;
	notify: any;
}

export const Deposit: React.FC<DepositProps> = ({
	onComplete,
	walletDetails,
	walletBalances,
	currentGasPrice,
	notify,
}) => {
	const [snxBalance, setSNXBalance] = useState<number>(0);
	const [isFetchingGasLimit, setFetchingGasLimit] = useState(false);
	const [gasLimit, setGasLimit] = useState(0);
	const [estimateType, setEstimateType] = useState('approve');
	const [hasAllowance, setAllowance] = useState(false);
	const [txPending, setTxPending] = useState(false);
	const { t } = useTranslation();
	const { networkId, currentWallet, walletType } = walletDetails;

	const handleApprove = async () => {
		setTxPending(true);
		const {
			utils,
			snxJS: { SecondaryDeposit, Synthetix },
		} = snxJSConnector;

		try {
			const tx = await Synthetix.contract.approve(
				SecondaryDeposit.contract.address,
				utils.parseEther(TOKEN_ALLOWANCE_LIMIT.toString()),
				{
					gasLimit,
					gasPrice: currentGasPrice.formattedPrice,
				}
			);
			if (notify && tx) {
				const { emitter } = notify.hash(tx.hash);
				emitter.on('txConfirmed', () => {
					setTxPending(false);
					fetchAllowance();
					return {
						message: 'Approval confirmed',
						onclick: () => window.open(getEtherscanTxLink(networkId, tx.hash), '_blank'),
					};
				});
			}
		} catch (e) {
			const errorMessage = errorMapper(e, walletType);
			setTxPending(false);
			console.log(errorMessage);
		}
	};

	const handleDeposit = async () => {
		setTxPending(true);
		const {
			utils,
			snxJS: { SecondaryDeposit },
		} = snxJSConnector;
		try {
			const snxBalanceBN = utils.parseEther(snxBalance.toString());
			const tx = await SecondaryDeposit.contract.deposit(snxBalanceBN, {
				gasLimit,
				gasPrice: currentGasPrice.formattedPrice,
			});
			if (notify && tx) {
				const { emitter } = notify.hash(tx.hash);
				emitter.on('txConfirmed', () => {
					setTxPending(false);
					onComplete();
					return {
						message: 'Deposit confirmed',
						onclick: () => window.open(getEtherscanTxLink(networkId, tx.hash), '_blank'),
					};
				});
			}
		} catch (e) {
			const errorMessage = errorMapper(e, walletType);
			setTxPending(false);
			console.log(errorMessage);
		}
	};

	const useGetGasEstimate = (setFetchingGasLimit, setGasLimit) => {
		const [error, setError] = useState(null);
		useEffect(() => {
			const {
				snxJS: { SecondaryDeposit, Synthetix },
				utils,
			} = snxJSConnector;
			const getGasEstimate = async () => {
				setError(null);
				try {
					setFetchingGasLimit(true);
					let gasEstimate;
					if (estimateType === 'approve') {
						gasEstimate = await Synthetix.contract.estimate.approve(
							SecondaryDeposit.contract.address,
							utils.parseEther(TOKEN_ALLOWANCE_LIMIT.toString())
						);
					} else {
						const snxBalanceBN = utils.parseEther(snxBalance.toString());
						gasEstimate = await SecondaryDeposit.contract.estimate.deposit(snxBalanceBN);
					}
					setGasLimit(addBufferToGasLimit(gasEstimate));
				} catch (e) {
					const errorMessage = (e && e.message) || 'input.error.gasEstimate';
					setError(t(errorMessage));
				}
				setFetchingGasLimit(false);
			};
			getGasEstimate();
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [setFetchingGasLimit, setGasLimit, estimateType]);
		return error;
	};

	const gasEstimateError = useGetGasEstimate(setFetchingGasLimit, setGasLimit);

	useEffect(() => {
		const getSNXBalance = async () => {
			setSNXBalance(walletBalances.crypto['SNX']);
		};
		getSNXBalance();
	}, [walletBalances]);

	const fetchAllowance = useCallback(async () => {
		const {
			snxJS: { Synthetix, SecondaryDeposit },
		} = snxJSConnector;
		try {
			const allowance = await Synthetix.allowance(currentWallet, SecondaryDeposit.contract.address);
			const hasAllowance = bigNumberFormatter(allowance) !== 0;
			if (hasAllowance) {
				setEstimateType('deposit');
			} else {
				setEstimateType('approve');
			}
			setAllowance(bigNumberFormatter(allowance) === 0 ? false : true);
		} catch (e) {
			console.log(e);
		}
	}, [currentWallet]);

	useEffect(() => {
		fetchAllowance();
		const refreshInterval = setInterval(fetchAllowance, 5000);
		return () => clearInterval(refreshInterval);
	}, [fetchAllowance]);

	return (
		<PageContainer>
			<Stepper activeIndex={3} />
			<HeaderIcon
				title="Deposit all SNX"
				subtext="This migrates your SNX from Layer 1 to Layer 2. If you complete this step, your SNX will not be on L1 anymore."
				icon={<SendIcon />}
			/>
			<ContainerStats>
				<StatBox multiple subtext={'DEPOSITING:'} tokenName="SNX" content={snxBalance.toString()} />
			</ContainerStats>
			{gasEstimateError && (
				<ContainerStats style={{ margin: 0 }}>
					<ErrorMessage message={gasEstimateError} />
				</ContainerStats>
			)}
			<ContainerStats>
				<GasIndicator
					style={{ margin: 0 }}
					isFetchingGasLimit={isFetchingGasLimit}
					gasLimit={gasLimit}
				/>
			</ContainerStats>
			{txPending ? (
				<Spinner />
			) : hasAllowance ? (
				<CTAButton
					disabled={gasEstimateError || txPending}
					onClick={() => {
						handleDeposit();
					}}
				>
					Deposit now
				</CTAButton>
			) : (
				<CTAButton
					disabled={gasEstimateError || txPending}
					onClick={() => {
						handleApprove();
					}}
				>
					Approve
				</CTAButton>
			)}
		</PageContainer>
	);
};

const PageContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const ContainerStats = styled.div`
	display: flex;
	margin: 16px 0px;
`;

const mapStateToProps = (state: any) => ({
	walletDetails: getWalletDetails(state),
	walletBalances: getWalletBalances(state),
	currentGasPrice: getCurrentGasPrice(state),
});

export default connect(mapStateToProps, null)(Deposit);
