import React from 'react';
import styled from 'styled-components';
import { ReactComponent as SendIcon } from '../../assets/images/send.svg';
import { CTAButton } from '../../components/L2Onboarding/CTAButton';
import { Stepper } from '../../components/L2Onboarding/Stepper';
import { StatBox } from '../../components/L2Onboarding/StatBox';
import { GasSettings } from 'components/L2Onboarding/GasSettings';
import { HeaderIcon } from 'components/L2Onboarding/HeaderIcon';

interface DepositProps {
	onComplete: Function;
}

export const Deposit: React.FC<DepositProps> = ({ onComplete }) => {
	return (
		<PageContainer>
			<Stepper activeIndex={3} />
			<HeaderIcon
				title="Deposit all SNX"
				subtext="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sodales mauris gravida etiam magnis duis fermentum."
				icon={<SendIcon />}
			/>
			<ContainerStats>
				<StatBox multiple subtext={'DEPOSITING:'} tokenName="SNX" content={'5,000.00'} />
			</ContainerStats>
			<GasSettings />
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
