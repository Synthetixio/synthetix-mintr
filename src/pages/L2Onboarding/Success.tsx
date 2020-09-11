import React from 'react';
import styled from 'styled-components';
import { ReactComponent as SuccessIcon } from '../../assets/images/L2/success.svg';
import { Stepper } from '../../components/L2Onboarding/Stepper';
import { HeaderIcon } from 'components/L2Onboarding/HeaderIcon';
import { ButtonPrimary } from 'components/Button';

interface SuccessProps {
	onComplete: Function;
}

export const Success: React.FC<SuccessProps> = ({ onComplete }) => {
	return (
		<PageContainer>
			<Stepper />
			<HeaderIcon
				title="Switch to L2 complete!"
				subtext="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sodales mauris gravida etiam
				magnis duis fermentum."
				icon={<SuccessIcon />}
			/>
			<CTAButton
				onClick={() => {
					onComplete();
				}}
			>
				Take me to mintr on l2
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

const CTAButton = styled(ButtonPrimary)`
	background: linear-gradient(130.52deg, #f49e25 -8.54%, #b252e9 101.04%);
	border: 1px solid #ff8fc5;
	margin-top: 16px;
`;
