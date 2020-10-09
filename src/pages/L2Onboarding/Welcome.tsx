import React from 'react';
import styled from 'styled-components';
import { fontFamilies } from 'styles/themes';
import { ReactComponent as BurnIcon } from '../../assets/images/L2/burn.svg';
import { ReactComponent as SendIcon } from '../../assets/images/L2/send.svg';
import { CTAButton } from 'components/L2Onboarding/component/CTAButton';
import { FlexDivCentered, FlexDivCol } from 'styles/common';

interface WelcomeProps {
	onNext: Function;
}

const Welcome: React.FC<WelcomeProps> = ({ onNext }) => {
	const steps = [
		{
			icon: <BurnIcon />,
			title: 'STEP 1: Burn all DEBT',
			copy:
				'Burn enough Goerli sUSD to cover your debt, as displayed in the left-hand panel on Mintr.',
		},
		{
			icon: <SendIcon />,
			title: 'STEP 2: DEPOSIT SNX to L2',
			copy:
				'This migrates your Goerli SNX from Layer 1 to Layer 2. If you complete this step, your Goerli SNX will not be on L1 anymore.',
		},
	];

	const returnStepBox = (icon: JSX.Element, title: string, copy: string, key: number) => (
		<ContainerIcons key={key}>
			<FlexDivCentered>{icon}</FlexDivCentered>
			<StepTitle>{title}</StepTitle>
			<StepDescription>{copy}</StepDescription>
		</ContainerIcons>
	);
	return (
		<PageContainer>
			<CenteredContainer>
				<GradientText>WELCOME TO</GradientText>
			</CenteredContainer>
			<Header>MINTR on L2 Testnet</Header>
			<Subtitle>
				These steps complete the process of migrating your Goerli Testnet SNX from Layer 1 to Layer
				2.
			</Subtitle>
			<FlexDivCentered>
				{steps.map(({ icon, title, copy }, i) => returnStepBox(icon, title, copy, i))}
			</FlexDivCentered>
			<CenteredContainer>
				<CTAButton style={{ margin: 48 }} onClick={() => onNext()}>
					Get Started
				</CTAButton>
			</CenteredContainer>
		</PageContainer>
	);
};

const PageContainer = styled.div`
	width: 100%;
	display: grid;
	grid-template-rows: 5;
	justify-content: center;
`;

const Header = styled.p`
	font-family: ${fontFamilies.bold};
	font-size: 48px;
	text-align: center;
	letter-spacing: 0.2px;
	color: #ffffff;
	text-shadow: 0px 0px 10px #b47598;
	margin: 24px;
`;

const Subtitle = styled.p`
	font-style: ${fontFamilies.regular};
	font-size: 18px;
	text-align: center;
	color: #cacaf1;
	margin: 24px;
`;

const ContainerIcons = styled(FlexDivCol)`
	justify-content: center;
	align-items: center;
`;

const StepTitle = styled.p`
	font-family: ${fontFamilies.regular};
	font-size: 16px;
	text-align: center;
	letter-spacing: 0.2px;
	text-transform: uppercase;
	color: #ffffff;
`;

const StepDescription = styled.p`
	font-family: ${fontFamilies.regular};
	font-size: 16px;
	width: 400px;
	line-height: 24px;
	margin: 0 24px;
	text-align: center;
	color: #cacaf1;
`;

const CenteredContainer = styled(FlexDivCentered)`
	width: 100%;
	justify-content: center;
`;

const GradientText = styled.p`
	font-family: ${fontFamilies.regular};
	font-size: 20px;
	background: linear-gradient(130.52deg, #f4c625 -8.54%, #e652e9 101.04%);
	background-clip: text;
	background-size: 100%;
	background-repeat: repeat;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	-moz-background-clip: text;
	-moz-text-fill-color: transparent;
`;

export default Welcome;
