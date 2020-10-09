import React from 'react';
import styled from 'styled-components';
import { ReactComponent as SuccessIcon } from '../../assets/images/L2/success.svg';
import { Stepper } from '../../components/L2Onboarding/Stepper';
import { HeaderIcon } from 'components/L2Onboarding/HeaderIcon';
import { CTAButton } from 'components/L2Onboarding/component/CTAButton';

interface SuccessProps {
	onComplete: Function;
}

export const Success: React.FC<SuccessProps> = ({ onComplete }) => {
	return (
		<PageContainer>
			<Stepper />
			<HeaderIcon
				title="Switch to L2 complete!"
				subtext="Your SNX has now been migrated to L2 from L1, for increased transaction speed and reduced gas costs. "
				icon={<SuccessIcon />}
			/>
			<CTAButton
				style={{ margin: 48 }}
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
