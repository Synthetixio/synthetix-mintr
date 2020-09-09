import React, { useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as CloseIcon } from '../../assets/images/close-icon.svg';
import { setCurrentPage } from '../../ducks/ui';
import { PAGES_BY_KEY } from 'constants/ui';
import { connect } from 'react-redux';
import { fontFamilies } from 'styles/themes';
import { Welcome } from './Welcome';
import Burn from './Burn';
import { Deposit } from './Deposit';
import { Metamask } from './Metamask';
import { Success } from './Success';

interface L2OnboardingProps {
	setCurrentPage: Function;
}

export const L2Onboarding: React.FC<L2OnboardingProps> = ({ setCurrentPage }) => {
	const [step, setStep] = useState<number>(1);

	const handleFinish = () => {
		// Direct to Mintr.io
	};

	const returnStep = () => {
		switch (step) {
			case 0:
				return <Welcome onNext={() => setStep(1)} />;
			case 1:
				return <Burn onComplete={() => setStep(2)} />;
			case 2:
				return <Deposit onComplete={() => setStep(3)} />;
			case 3:
				return <Metamask onComplete={() => setStep(4)} />;
			case 4:
				return <Success onComplete={() => handleFinish()} />;
			default:
				return <Welcome onNext={() => setStep(1)} />;
		}
	};
	return (
		<ContainerPage>
			<StyledHeaderRow>
				<StyledCloseIcon onClick={() => setCurrentPage(PAGES_BY_KEY.MAIN)} />
				<Button onClick={() => {}}>READ THE BLOG POST</Button>
			</StyledHeaderRow>
			{returnStep()}
		</ContainerPage>
	);
};

const ContainerPage = styled.div`
	width: 100%;
	height: 100vh;
	padding: 48px;
	background: #020b29;
`;

const StyledCloseIcon = styled(CloseIcon)`
	width: 48px;
	cursor: pointer;
`;

const StyledHeaderRow = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
`;

const Button = styled.button`
	font-family: ${fontFamilies.regular};
	text-transform: uppercase;
	width: 159px;
	height: 32px;
	background: #282862;
	color: #cacaf1;
	border: none;
`;

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = {
	setCurrentPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(L2Onboarding);
