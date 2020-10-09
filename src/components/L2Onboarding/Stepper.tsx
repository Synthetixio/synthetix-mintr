import React from 'react';
import styled from 'styled-components';
import { fontFamilies } from 'styles/themes';

interface StepperProps {
	activeIndex?: number;
}

export const Stepper: React.FC<StepperProps> = ({ activeIndex }) => {
	const steps = [
		{
			title: '1. BURN DEBT',
		},
		{
			title: '2: DEPOSIT SNX',
		},
	];
	return (
		<ContainerStepper>
			{steps.map((step, i) => (
				<Section key={i}>
					<Label active={activeIndex === i}>{step.title}</Label>
					{i !== steps.length - 1 && <Bar />}
				</Section>
			))}
		</ContainerStepper>
	);
};

const ContainerStepper = styled.div`
	display: flex;
	margin-bottom: 20px;
`;

const Section = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-evenly;
`;

const Label = styled.p<any>`
	font-family: ${fontFamilies.regular};
	font-size: 16px;
	line-height: 20px;
	display: flex;
	align-items: center;
	text-align: center;
	letter-spacing: 0.2px;
	text-transform: uppercase;
	color: #ffffff;
	opacity: ${(props: any) => (props.active ? 1 : 0.5)};
`;

const Bar = styled.div`
	width: 32px;
	height: 0px;
	border: 1px solid #00e2df;
	margin: 0px 16px;
`;
