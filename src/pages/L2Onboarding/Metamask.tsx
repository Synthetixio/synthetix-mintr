import React from 'react';
import styled from 'styled-components';
import { ReactComponent as MetamaskIcon } from '../../assets/images/L2/metamask.svg';
import { Stepper } from '../../components/L2Onboarding/Stepper';
import { HeaderIcon } from 'components/L2Onboarding/HeaderIcon';
import { CTAButton } from 'components/L2Onboarding/component/CTAButton';

interface MetamaskProps {
	onComplete: Function;
}

export const Metamask: React.FC<MetamaskProps> = ({ onComplete }) => {
	return (
		<PageContainer>
			<Stepper activeIndex={2} />
			<HeaderIcon
				title="Switch to Metamask"
				subtext="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sodales mauris gravida etiam
				magnis duis fermentum."
				icon={<MetamaskIcon />}
			/>
			<CTAButton
				onClick={() => {
					onComplete();
				}}
			>
				Launch Metamask
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
