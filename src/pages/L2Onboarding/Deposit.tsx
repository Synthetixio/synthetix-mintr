import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { ReactComponent as SendIcon } from '../../assets/images/L2/send.svg';
import { CTAButton } from '../../components/L2Onboarding/CTAButton';
import { Stepper } from '../../components/L2Onboarding/Stepper';
import { StatBox } from '../../components/L2Onboarding/StatBox';
import { HeaderIcon } from 'components/L2Onboarding/HeaderIcon';
import GasIndicator from 'components/L2Onboarding/GasIndicator';
import { useGetGasEstimate } from './hooks/useGetGasEstimate';
import { getWalletDetails } from 'ducks/wallet';
import { connect } from 'react-redux';
import { bytesFormatter } from 'helpers/formatters';
import { useGetDebtData } from './hooks/useGetDebtData';
import { getCurrentGasPrice } from 'ducks/network';
import { getWalletBalances } from 'ducks/balances';
import { CRYPTO_CURRENCY_TO_KEY } from '../../constants/currency';
import ErrorMessage from 'components/ErrorMessage';

interface DepositProps {
	onComplete: Function;
	walletDetails: any;
	currentGasPrice: any;
	walletBalances: any;
}

export const Deposit: React.FC<DepositProps> = ({
	onComplete,
	walletDetails,
	currentGasPrice,
	walletBalances,
}) => {
	const { currentWallet } = walletDetails;
	const [snxBalance, setSNXBalance] = useState<number>(0);
	const [isFetchingGasLimit, setFetchingGasLimit] = useState(false);
	const [gasLimit, setGasLimit] = useState(0);
	const sUSDBytes = bytesFormatter('sUSD');
	const debtData = useGetDebtData(currentWallet, sUSDBytes);
	const gasEstimateError = useGetGasEstimate(
		debtData.sUSDBalance,
		debtData.maxBurnAmount,
		debtData.maxBurnAmountBN,
		debtData.sUSDBalance,
		null,
		null,
		setFetchingGasLimit,
		setGasLimit
	);
	const getSNXBalance = useCallback(async () => {
		setSNXBalance(walletBalances.crypto[CRYPTO_CURRENCY_TO_KEY.SNX]);
	}, [walletBalances]);

	useEffect(() => {
		getSNXBalance();
	}, [getSNXBalance]);
	return (
		<PageContainer>
			<Stepper activeIndex={3} />
			<HeaderIcon
				title="Deposit all SNX"
				subtext="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sodales mauris gravida etiam magnis duis fermentum."
				icon={<SendIcon />}
			/>
			<ContainerStats>
				<StatBox multiple subtext={'DEPOSITING:'} tokenName="SNX" content={snxBalance.toString()} />
			</ContainerStats>
			<ContainerStats>
				<ErrorMessage message={gasEstimateError} />
			</ContainerStats>
			<GasIndicator isFetchingGasLimit={isFetchingGasLimit} gasLimit={gasLimit} />
			<CTAButton
				copy="DEPOSIT NOW"
				handleClick={() => {
					onComplete();
				}}
			/>
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
	currentGasPrice: getCurrentGasPrice(state),
	walletBalances: getWalletBalances(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Deposit);
