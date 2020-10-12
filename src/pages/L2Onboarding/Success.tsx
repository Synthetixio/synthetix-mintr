import React from 'react';
import styled from 'styled-components';
import { ReactComponent as SuccessIcon } from '../../assets/images/L2/success.svg';
import { Stepper } from '../../components/L2Onboarding/Stepper';
import { HeaderIcon } from 'components/L2Onboarding/HeaderIcon';
import { CTAButton } from 'components/L2Onboarding/component/CTAButton';
import { ExternalLink } from 'styles/common';
import { getL2ExplorerTxLink } from 'helpers/explorers';

interface SuccessProps {
	onComplete: Function;
	transactionHash: string;
}

const Success: React.FC<SuccessProps> = ({ onComplete, transactionHash }) => {
	return (
		<PageContainer>
			<Stepper activeIndex={3} />
			<HeaderIcon
				title="Switch to L2 complete!"
				subtext="Your SNX has now been migrated to L2 testnet from L1 Goerli testnet. You can now try the increased transaction speed and reduced gas costs."
				icon={<SuccessIcon />}
			/>

			<ButtonBlock>
				<StyledLink href={getL2ExplorerTxLink(transactionHash)}>Verify transaction ↗</StyledLink>
				<Button onClick={onComplete}>Take me to mintr on l2</Button>
			</ButtonBlock>
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

const ButtonBlock = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 60px;
`;

const Button = styled(CTAButton)`
	margin-top: 36px;
`;

const StyledLink = styled(ExternalLink)`
	text-transform: uppercase;
	font-family: 'apercu-bold';
	font-size: 14px;
	color: #00e2df;
`;

export default Success;
