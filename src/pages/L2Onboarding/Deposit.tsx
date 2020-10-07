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

interface DepositProps {
	onComplete: Function;
	walletDetails: any;
	walletBalances: any;
}

export const Deposit: React.FC<DepositProps> = ({ onComplete, walletDetails, walletBalances }) => {
	const [snxBalance, setSNXBalance] = useState<number>(0);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isFetchingGasLimit, setFetchingGasLimit] = useState(false);

	// @TODO: Change gasLimit hard code
	const gasLimit = 50000;

	useEffect(() => {
		const getSNXBalance = async () => {
			console.log(walletBalances);
			setSNXBalance(walletBalances.crypto['SNX']);
		};
		getSNXBalance();
	}, [walletBalances]);

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
			{errorMessage && (
				<ContainerStats style={{ margin: 0 }}>
					<ErrorMessage message={errorMessage} />
				</ContainerStats>
			)}
			<ContainerStats>
				<GasIndicator
					style={{ margin: 0 }}
					isFetchingGasLimit={isFetchingGasLimit}
					gasLimit={gasLimit}
				/>
			</ContainerStats>
			<CTAButton
				onClick={() => {
					onComplete();
				}}
			>
				Deposit now
			</CTAButton>
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
});

export default connect(mapStateToProps, null)(Deposit);
