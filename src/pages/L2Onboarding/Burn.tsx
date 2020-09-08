import React from 'react';
import styled from 'styled-components';
import { ReactComponent as BurnIcon } from '../../assets/images/burn.svg';
import { Stepper } from '../../components/L2Onboarding/Stepper';
import { StatBox } from '../../components/L2Onboarding/StatBox';
import { CTAButton } from '../../components/L2Onboarding/CTAButton';
import { GasSettings } from 'components/L2Onboarding/GasSettings';
import { HeaderIcon } from 'components/L2Onboarding/HeaderIcon';

interface BurnProps {
	onComplete: Function;
}

export const Burn: React.FC<BurnProps> = ({ onComplete }) => {
	return (
		<PageContainer>
			<Stepper activeIndex={0} />
			<HeaderIcon
				title="Burn all L1 debt"
				subtext="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sodales mauris gravida etiam magnis duis fermentum."
				icon={<BurnIcon />}
			/>
			<ContainerStats>
				<StatBox multiple subtext={'BURNING:'} content={'5,000.00 sUSD'} />
				<StatBox multiple subtext={'UNLOCKING:'} content={'5,000.00 sUSD'} />
			</ContainerStats>
			<GasSettings />
			<CTAButton
				copy="BURN NOW"
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
