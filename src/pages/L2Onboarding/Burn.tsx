import React from 'react';
import styled from 'styled-components';
import { ReactComponent as BurnIcon } from '../../assets/images/burn.svg';
import { fontFamilies } from 'styles/themes';
import { Stepper } from './components/Stepper';
import { StatBox } from './components/StatBox';
import { CTAButton } from './components/CTAButton';

interface BurnProps {
	onComplete: Function;
}

export const Burn: React.FC<BurnProps> = ({ onComplete }) => {
	return (
		<PageContainer>
			<Stepper activeIndex={0} />
			<Icon>
				<BurnIcon />
			</Icon>
			<Header>Burn all L1 debt</Header>
			<Subtext>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sodales mauris gravida etiam
				magnis duis fermentum.
			</Subtext>
			<ContainerStats>
				<StatBox multiple subtext={'BURNING:'} content={'5,000.00 sUSD'} />
				<StatBox multiple subtext={'UNLOCKING:'} content={'5,000.00 sUSD'} />
			</ContainerStats>
			<GasStat>
				<StatText>GAS: $0.083 / SPEED: ~5:24 mins</StatText>
				<EditButton>EDIT</EditButton>
			</GasStat>
			<CTAButton copy="BURN NOW" handleClick={() => {}} />
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

const ContainerStats = styled.div`
	display: flex;
	margin: 16px 0px;
`;

const GasStat = styled.div`
	display: flex;
	align-items: center;
`;

const StatText = styled.p`
	font-family: ${fontFamilies.regular};
	font-size: 14px;
	line-height: 24px;
	text-align: center;
	letter-spacing: 0.175px;
	color: #cacaf1;
`;

const EditButton = styled.p`
	font-family: ${fontFamilies.bold};
	font-size: 14px;
	line-height: 17px;
	text-align: center;
	letter-spacing: 0.5px;
	text-transform: uppercase;
	color: #00e2df;
	margin-left: 16px;
	cursor: pointer;
`;
