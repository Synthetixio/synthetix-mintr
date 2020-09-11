import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ReactComponent as SendIcon } from '../../assets/images/L2/send.svg';
import { Stepper } from '../../components/L2Onboarding/Stepper';
import { StatBox } from '../../components/L2Onboarding/StatBox';
import { HeaderIcon } from 'components/L2Onboarding/HeaderIcon';
import { getWalletDetails } from 'ducks/wallet';
import { connect } from 'react-redux';
import { getWalletBalances } from 'ducks/balances';
import { CRYPTO_CURRENCY_TO_KEY } from '../../constants/currency';
import { ButtonPrimary } from 'components/Button';

interface DepositProps {
	onComplete: Function;
	walletDetails: any;
	walletBalances: any;
}

export const Deposit: React.FC<DepositProps> = ({ onComplete, walletDetails, walletBalances }) => {
	const [snxBalance, setSNXBalance] = useState<number>(0);

	useEffect(() => {
		const getSNXBalance = async () => {
			setSNXBalance(walletBalances.crypto[CRYPTO_CURRENCY_TO_KEY.SNX]);
		};
		getSNXBalance();
	}, [walletBalances]);

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
			{/* <ContainerStats>
				<ErrorMessage message={gasEstimateError} />
			</ContainerStats>
			<GasIndicator isFetchingGasLimit={isFetchingGasLimit} gasLimit={gasLimit} /> */}
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

const CTAButton = styled(ButtonPrimary)`
	background: linear-gradient(130.52deg, #f49e25 -8.54%, #b252e9 101.04%);
	border: 1px solid #ff8fc5;
`;

const mapStateToProps = (state: any) => ({
	walletDetails: getWalletDetails(state),
	walletBalances: getWalletBalances(state),
});

export default connect(mapStateToProps, null)(Deposit);
