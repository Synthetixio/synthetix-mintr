import React from 'react';
import styled from 'styled-components';
import { fontFamilies } from 'styles/themes';
import { ReactComponent as WelcomeText } from '../../assets/images/welcome-text.svg';
import { ReactComponent as BurnIcon } from '../../assets/images/burn.svg';
import { ReactComponent as SendIcon } from '../../assets/images/send.svg';
import { ReactComponent as MetamaskIcon } from '../../assets/images/metamask.svg';
import { CTAButton } from '../../components/L2Onboarding/CTAButton';

interface WelcomeProps {
	onNext: Function;
}

export const Welcome: React.FC<WelcomeProps> = ({ onNext }) => {
	const steps = [
		{
			icon: <BurnIcon />,
			title: 'STEP 1: Burn all DEBT',
			copy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		},
		{
			icon: <SendIcon />,
			title: 'STEP 2: DEPOSIT SNX to L2',
			copy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		},
		{
			icon: <MetamaskIcon />,
			title: 'STEP 3: SWITCH TO METAMASK ',
			copy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		},
	];

	const returnStepBox = (icon: object, title: string, copy: string, key: number) => (
		<ContainerIcons key={key}>
			<Icon>{icon}</Icon>
			<StepTitle>{title}</StepTitle>
			<StepDescription>{copy}</StepDescription>
		</ContainerIcons>
	);
	return (
		<PageContainer>
			<WelcomeText />
			<Header>MINTR on L2</Header>
			<Subtitle>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sodales mauris gravida etiam
				magnis duis fermentum.
			</Subtitle>
			<ContainerSteps>
				{steps.map(({ icon, title, copy }, i) => returnStepBox(icon, title, copy, i))}
			</ContainerSteps>
			<CTAButton copy="GET STARTED" handleClick={() => onNext()} />
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

const Header = styled.p`
	font-family: ${fontFamilies.bold};
	font-size: 48px;
	text-align: center;
	letter-spacing: 0.2px;
	color: #ffffff;
	text-shadow: 0px 0px 10px #b47598;
`;

const Subtitle = styled.p`
	font-style: ${fontFamilies.regular};
	font-size: 18px;
	text-align: center;
	color: #cacaf1;
`;

const ContainerSteps = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
`;

const ContainerIcons = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 300px;
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
	line-height: 24px;
	margin: 0 24px;
	text-align: center;
	color: #cacaf1;
`;

const Icon = styled.div`
	min-height: 140px;
	max-height: 140px;
	display: flex;
	justify-content: center;
	align-items: center;
`;
