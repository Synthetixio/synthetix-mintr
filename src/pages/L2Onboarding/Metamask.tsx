import React from 'react';
import styled from 'styled-components';
import { fontFamilies } from 'styles/themes';
import { ReactComponent as MetamaskIcon } from '../../assets/images/metamask.svg';
import { CTAButton } from './components/CTAButton';
import { Stepper } from './components/Stepper';

interface MetamaskProps {
	onComplete: Function;
}

export const Metamask: React.FC<MetamaskProps> = ({ onComplete }) => {
	return (
		<PageContainer>
			<Stepper activeIndex={2} />
			<Icon>
				<MetamaskIcon />
			</Icon>
			<Header>Switch to Metamask</Header>
			<Subtext>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sodales mauris gravida etiam
				magnis duis fermentum.
			</Subtext>
			<CTAButton
				copy="Launch Metamask"
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

const Header = styled.p`
	font-family: ${fontFamilies.bold};
	font-size: 40px;
	text-align: center;
	letter-spacing: 0.2px;
	color: #ffffff;
	text-shadow: 0px 0px 10px #b47598;
	margin: 16px 0px;
`;

const Subtext = styled.p`
	font-family: ${fontFamilies.regular};
	font-size: 16px;
	text-align: center;
	letter-spacing: 0.2px;
	color: #cacaf1;
	width: 400px;
`;

const Icon = styled.div`
	min-height: 100px;
	max-height: 100px;
	margin-bottom: 16px;
`;
