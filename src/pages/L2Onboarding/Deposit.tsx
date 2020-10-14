import React, { useState, useEffect } from 'react';
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
import { addBufferToGasLimit, formatGasPrice } from 'helpers/networkHelper';
import { useTranslation } from 'react-i18next';
import { bigNumberFormatter } from 'helpers/formatters';
import errorMapper from 'helpers/errorMapper';
import Spinner from 'components/Spinner';

const INTERVAL_TIMER = 3000;

const DEFAULT_GAS_PRICE = 1;

const ESTIMATE_TYPES = {
	APPROVE: 'approve',
	DEPOSIT: 'deposit',
};

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
	const snxBalance = (walletBalances && walletBalances.crypto['SNX']) || 0;

	const [isWaitingForAllowance, setIsWaitingForAllowance] = useState(false);
	const [gasLimit, setGasLimit] = useState(0);
	const [estimateType, setEstimateType] = useState(ESTIMATE_TYPES.APPROVE);
	const [hasAllowance, setAllowance] = useState(false);
	const [txPending, setTxPending] = useState(false);
	const [gasEstimateError, setGasEstimateError] = useState(null);

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
					gasPrice: formatGasPrice(DEFAULT_GAS_PRICE),
				}
			);
			if (notify && tx) {
				const { emitter } = notify.hash(tx.hash);
				emitter.on('txConfirmed', () => {
					setTxPending(false);
					setIsWaitingForAllowance(true);
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
				gasPrice: formatGasPrice(DEFAULT_GAS_PRICE),
			});
			if (notify && tx) {
				const { emitter } = notify.hash(tx.hash);
				emitter.on('txConfirmed', () => {
					setTxPending(false);
					onComplete(tx.hash);
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

	useEffect(() => {
		const {
			snxJS: { SecondaryDeposit, Synthetix },
			utils,
		} = snxJSConnector;
		const getGasEstimate = async () => {
			setGasEstimateError(null);
			try {
				// setFetchingGasLimit(true);
				let gasEstimate;
				if (estimateType === ESTIMATE_TYPES.APPROVE) {
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
				setGasEstimateError(t(errorMessage));
			}
			// setFetchingGasLimit(false);
		};
		getGasEstimate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setGasLimit, estimateType]);

	const fetchAllowance = async () => {
		const {
			snxJS: { Synthetix, SecondaryDeposit },
		} = snxJSConnector;
		try {
			const allowance = await Synthetix.allowance(currentWallet, SecondaryDeposit.contract.address);
			const hasAllowance = bigNumberFormatter(allowance) !== 0;
			if (hasAllowance) {
				setEstimateType(ESTIMATE_TYPES.DEPOSIT);
				setIsWaitingForAllowance(false);
			} else {
				setEstimateType(ESTIMATE_TYPES.APPROVE);
			}
			setAllowance(bigNumberFormatter(allowance) === 0 ? false : true);
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		if (!currentWallet) return;
		fetchAllowance();
		const refreshInterval = setInterval(fetchAllowance, INTERVAL_TIMER);
		return () => clearInterval(refreshInterval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet]);

	return (
		<PageContainer>
			<Stepper activeIndex={1} />
			<HeaderIcon
				title="Deposit all SNX"
				subtext="This migrates your SNX from Goerli testnet Layer 1 to Layer 2 testnet. If you complete this step, it will not affect your L1 SNX on mainnet."
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
				{/* <GasIndicator
					style={{ margin: 0 }}
					isFetchingGasLimit={isFetchingGasLimit}
					gasLimit={gasLimit}
				/> */}
			</ContainerStats>
			{txPending || isWaitingForAllowance ? (
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
