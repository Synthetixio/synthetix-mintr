import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { ReactComponent as BurnIcon } from '../../assets/images/L2/burn.svg';
import { Stepper } from '../../components/L2Onboarding/Stepper';
import { StatBox } from '../../components/L2Onboarding/StatBox';
import { HeaderIcon } from 'components/L2Onboarding/HeaderIcon';
import { connect } from 'react-redux';
import { getWalletDetails } from 'ducks/wallet';
import { getCurrentGasPrice } from 'ducks/network';
import { bytesFormatter, secondsToTime } from 'helpers/formatters';
import snxJSConnector from 'helpers/snxJSConnector';
import GasIndicator from 'components/L2Onboarding/GasIndicator';
import ErrorMessage from '../../components/ErrorMessage';
import { addSeconds, differenceInSeconds } from 'date-fns';
import errorMapper from 'helpers/errorMapper';
import { Subtext } from 'components/Typography';
import { useTranslation } from 'react-i18next';
import { addBufferToGasLimit } from 'helpers/networkHelper';
import { CTAButton } from 'components/L2Onboarding/component/CTAButton';
import { getDebtStatusData } from 'ducks/debtStatus';
import { getEtherscanTxLink } from 'helpers/explorers';

interface BurnProps {
	onComplete: Function;
	walletDetails: any;
	currentGasPrice: any;
	currentsUSDBalance: number;
	debtData: any;
	notify: any;
}

const Burn: React.FC<BurnProps> = ({
	onComplete,
	walletDetails,
	currentGasPrice,
	currentsUSDBalance,
	debtData,
	notify,
}) => {
	const [waitingPeriod, setWaitingPeriod] = useState(0);
	const [issuanceDelay, setIssuanceDelay] = useState(0);
	const { currentWallet, walletType, networkId } = walletDetails;
	const [isFetchingGasLimit, setFetchingGasLimit] = useState(false);
	const [gasLimit, setGasLimit] = useState(0);
	const [isBurning, setIsBurning] = useState<boolean>(false);
	const { t } = useTranslation();

	const useGetGasEstimate = (
		burnAmount,
		sUSDBalance,
		waitingPeriod,
		issuanceDelay,
		setFetchingGasLimit,
		setGasLimit
	) => {
		const [error, setError] = useState(null);
		useEffect(() => {
			const getGasEstimate = async () => {
				setError(null);
				try {
					if (burnAmount === 0) throw new Error('You have no debt to burn');
					if (waitingPeriod) throw new Error('Waiting period for sUSD is still ongoing');
					if (issuanceDelay) throw new Error('Waiting period to burn is still ongoing');
					if (burnAmount > sUSDBalance) throw new Error('input.error.notEnoughToBurn');
					setFetchingGasLimit(true);
					const gasEstimate = await snxJSConnector.snxJS.Synthetix.contract.estimate.burnSynths(
						debtData.debtBalanceBN
					);
					setGasLimit(addBufferToGasLimit(gasEstimate));
				} catch (e) {
					const errorMessage = (e && e.message) || 'input.error.gasEstimate';
					setError(t(errorMessage));
				}
				setFetchingGasLimit(false);
			};
			getGasEstimate();
		}, [burnAmount, waitingPeriod, issuanceDelay, setFetchingGasLimit, sUSDBalance, setGasLimit]);
		return error;
	};

	const gasEstimateError = useGetGasEstimate(
		debtData.debtBalance,
		currentsUSDBalance,
		waitingPeriod,
		issuanceDelay,
		setFetchingGasLimit,
		setGasLimit
	);

	const getMaxSecsLeftInWaitingPeriod = useCallback(async () => {
		const {
			snxJS: { Exchanger },
		} = snxJSConnector;
		try {
			const maxSecsLeftInWaitingPeriod = await Exchanger.maxSecsLeftInWaitingPeriod(
				currentWallet,
				bytesFormatter('sUSD')
			);
			setWaitingPeriod(Number(maxSecsLeftInWaitingPeriod));
		} catch (e) {
			console.log(e);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getIssuanceDelay = useCallback(async () => {
		const {
			snxJS: { Issuer },
		} = snxJSConnector;
		try {
			const [canBurnSynths, lastIssueEvent, minimumStakeTime] = await Promise.all([
				Issuer.canBurnSynths(currentWallet),
				Issuer.lastIssueEvent(currentWallet),
				Issuer.minimumStakeTime(),
			]);

			if (Number(lastIssueEvent) && Number(minimumStakeTime)) {
				const burnUnlockDate = addSeconds(Number(lastIssueEvent) * 1000, Number(minimumStakeTime));
				const issuanceDelayInSeconds = differenceInSeconds(burnUnlockDate, new Date());
				setIssuanceDelay(
					issuanceDelayInSeconds > 0 ? issuanceDelayInSeconds : canBurnSynths ? 0 : 1
				);
			}
		} catch (e) {
			console.log(e);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		getMaxSecsLeftInWaitingPeriod();
		getIssuanceDelay();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getMaxSecsLeftInWaitingPeriod, getIssuanceDelay]);

	const onBurn = async () => {
		setIsBurning(true);
		const {
			snxJS: { Synthetix, Issuer },
		} = snxJSConnector;
		try {
			if (await Synthetix.isWaitingPeriod(bytesFormatter('sUSD')))
				throw new Error('Waiting period for sUSD is still ongoing');

			if (!(await Issuer.canBurnSynths(currentWallet)))
				throw new Error('Waiting period to burn is still ongoing');

			const tx = await Synthetix.burnSynths(debtData.debtBalanceBN, {
				gasPrice: currentGasPrice.formattedPrice,
				gasLimit,
			});

			if (notify && tx) {
				const { emitter } = notify.hash(tx.hash);
				emitter.on('txConfirmed', () => {
					setIsBurning(false);
					onComplete();
					return {
						onclick: () => window.open(getEtherscanTxLink(networkId, tx.hash), '_blank'),
					};
				});
			}
		} catch (e) {
			const errorMessage = errorMapper(e, walletType);
			setIsBurning(false);
			console.log(errorMessage);
		}
	};

	const renderSubmitButton = () => {
		if (issuanceDelay) {
			return (
				<RetryButtonWrapper>
					<CTAButton
						onClick={() => {
							getIssuanceDelay();
							if (waitingPeriod) {
								getMaxSecsLeftInWaitingPeriod();
							}
						}}
					>
						Retry
					</CTAButton>
					<Subtext style={{ position: 'absolute', fontSize: '12px' }}>
						There is a waiting period after minting before you can burn. Please wait{' '}
						{secondsToTime(issuanceDelay)} before attempting to burn sUSD.
					</Subtext>
				</RetryButtonWrapper>
			);
		} else if (waitingPeriod) {
			return (
				<RetryButtonWrapper>
					<CTAButton onClick={getMaxSecsLeftInWaitingPeriod}>Retry</CTAButton>
					<Subtext style={{ position: 'absolute', fontSize: '12px' }}>
						There is a waiting period after completing a trade. Please wait{' '}
						{secondsToTime(waitingPeriod)} before attempting to burn sUSD.
					</Subtext>
				</RetryButtonWrapper>
			);
		} else {
			return (
				<CTAButton
					disabled={
						isFetchingGasLimit || gasEstimateError || debtData.debtBalance === 0 || isBurning
					}
					onClick={onBurn}
				>
					Burn
				</CTAButton>
			);
		}
	};

	return (
		<PageContainer>
			<Stepper activeIndex={0} />
			<HeaderIcon
				title="Burn all L1 debt"
				subtext="To begin migrating your SNX, first you’ll need to burn enough sUSD to cover your debt and unlock your staked SNX. "
				icon={<BurnIcon />}
			/>
			<ContainerStats>
				<StatBox
					multiple
					subtext={'BURNING:'}
					tokenName="sUSD"
					content={`${debtData.debtBalance ?? 0}`}
				/>
				<StatBox
					multiple
					subtext={'UNLOCKING:'}
					tokenName="SNX"
					content={`${
						Math.max(
							(debtData.debtBalance - debtData.debtEscrow) /
								debtData.targetCRatio /
								debtData.SNXPrice,
							0
						) ?? 0
					}`}
				/>
			</ContainerStats>
			{gasEstimateError && (
				<ContainerStats style={{ margin: 0 }}>
					<ErrorMessage message={gasEstimateError} />
				</ContainerStats>
			)}
			<ContainerStats style={{ margin: 0 }}>
				<GasIndicator isFetchingGasLimit={isFetchingGasLimit} gasLimit={gasLimit} />
			</ContainerStats>
			{renderSubmitButton()}
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

const RetryButtonWrapper = styled.div`
	position: relative;
`;

const mapStateToProps = (state: any) => ({
	walletDetails: getWalletDetails(state),
	currentGasPrice: getCurrentGasPrice(state),
	debtData: getDebtStatusData(state),
});

export default connect(mapStateToProps, null)(Burn);
