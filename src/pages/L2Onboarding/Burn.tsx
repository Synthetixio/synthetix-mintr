import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { ReactComponent as BurnIcon } from '../../assets/images/burn.svg';
import { Stepper } from '../../components/L2Onboarding/Stepper';
import { StatBox } from '../../components/L2Onboarding/StatBox';
import { CTAButton } from '../../components/L2Onboarding/CTAButton';
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
import { useGetDebtData } from './hooks/useGetDebtData';
import { useGetGasEstimate } from './hooks/useGetGasEstimate';
import { ISSUANCE_EVENTS } from 'constants/events';

interface BurnProps {
	onComplete: Function;
	walletDetails: any;
	currentGasPrice: any;
}

const Burn: React.FC<BurnProps> = ({ onComplete, walletDetails, currentGasPrice }) => {
	const [transferableAmount, setTransferableAmount] = useState<number>(0);
	const [waitingPeriod, setWaitingPeriod] = useState(0);
	const [issuanceDelay, setIssuanceDelay] = useState(0);
	const { currentWallet, walletType } = walletDetails;
	const [isFetchingGasLimit, setFetchingGasLimit] = useState(false);
	const [gasLimit, setGasLimit] = useState(0);
	const sUSDBytes = bytesFormatter('sUSD');
	const debtData = useGetDebtData(currentWallet, sUSDBytes);

	const gasEstimateError = useGetGasEstimate(
		debtData.sUSDBalance,
		debtData.maxBurnAmount,
		debtData.maxBurnAmountBN,
		debtData.sUSDBalance,
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

	const setMaxTransferableAmount = useCallback(() => {
		const amountNB = Number(debtData.sUSDBalance);
		setTransferableAmount(
			amountNB
				? Math.max((amountNB - debtData.debtEscrow) / debtData.issuanceRatio / debtData.SNXPrice, 0)
				: 0
		);
	}, [debtData]);

	useEffect(() => {
		setMaxTransferableAmount();
	}, [debtData, setMaxTransferableAmount]);

	const onBurn = async () => {
		const {
			snxJS: { Synthetix, Issuer, sUSD },
		} = snxJSConnector;
		try {
			if (await Synthetix.isWaitingPeriod(bytesFormatter('sUSD')))
				throw new Error('Waiting period for sUSD is still ongoing');

			if (!(await Issuer.canBurnSynths(currentWallet)))
				throw new Error('Waiting period to burn is still ongoing');

			let transaction;

			const amountToBurn =
				debtData.sUSDBalance === debtData.maxBurnAmount
					? debtData.maxBurnAmountBN
					: snxJSConnector.utils.parseEther(debtData.sUSDBalance.toString());
			transaction = await Synthetix.burnSynths(amountToBurn, {
				gasPrice: currentGasPrice.formattedPrice,
				gasLimit,
			});

			if (transaction) {
				sUSD.contract.on(ISSUANCE_EVENTS.BURNED, (account: string) => {
					if (account === currentWallet) {
						onComplete();
					}
				});
			}
		} catch (e) {
			console.log(e);
			const errorMessage = errorMapper(e, walletType);
			console.log(errorMessage);
		}
	};

	const renderSubmitButton = () => {
		if (issuanceDelay) {
			return (
				<RetryButtonWrapper>
					<CTAButton
						copy="RETRY"
						handleClick={() => {
							getIssuanceDelay();
							if (waitingPeriod) {
								getMaxSecsLeftInWaitingPeriod();
							}
						}}
					/>
					<Subtext style={{ position: 'absolute', fontSize: '12px' }}>
						There is a waiting period after minting before you can burn. Please wait{' '}
						{secondsToTime(issuanceDelay)} before attempting to burn sUSD.
					</Subtext>
				</RetryButtonWrapper>
			);
		} else if (waitingPeriod) {
			return (
				<RetryButtonWrapper>
					<CTAButton copy="RETRY" handleClick={getMaxSecsLeftInWaitingPeriod} />
					<Subtext style={{ position: 'absolute', fontSize: '12px' }}>
						There is a waiting period after completing a trade. Please wait{' '}
						{secondsToTime(waitingPeriod)} before attempting to burn sUSD.
					</Subtext>
				</RetryButtonWrapper>
			);
		} else {
			return (
				<CTAButton
					disabled={isFetchingGasLimit || gasEstimateError || debtData.sUSDBalance === 0}
					copy="BURN"
					handleClick={onBurn}
				/>
			);
		}
	};

	if (debtData) {
		return (
			<PageContainer>
				<Stepper activeIndex={0} />
				<HeaderIcon
					title="Burn all L1 debt"
					subtext="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sodales mauris gravida etiam magnis duis fermentum."
					icon={<BurnIcon />}
				/>
				<ContainerStats>
					<StatBox
						multiple
						subtext={'BURNING:'}
						tokenName="sUSD"
						content={`${debtData.sUSDBalance ?? 0}`}
					/>
					<StatBox
						multiple
						subtext={'UNLOCKING:'}
						tokenName="SNX"
						content={`${transferableAmount ?? 0}`}
					/>
				</ContainerStats>
				<ContainerStats>
					<ErrorMessage message={gasEstimateError} />
				</ContainerStats>
				<GasIndicator isFetchingGasLimit={isFetchingGasLimit} gasLimit={gasLimit} />
				{renderSubmitButton()}
			</PageContainer>
		);
	} else {
		return null;
	}
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
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Burn);
