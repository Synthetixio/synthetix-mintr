import React from 'react';
import styled from 'styled-components';
import { PMedium } from '../Typography';
import { ReactComponent as DiagonalArrow } from '../../assets/images/Banner/DiagonalArrow.svg';

export const L2Banner: React.FC = () => {
	return (
		<ContainerBanner>
			<StyledPMedium>Save on gas fees by staking on l2. Click here to move to l2!</StyledPMedium>
			<DiagonalArrow />
		</ContainerBanner>
	);
};

const ContainerBanner = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 2px;
	width: 100%;
	background: linear-gradient(90deg, #0885fe, #4e3cbd);
	color: white;
	cursor: pointer;
`;

const StyledPMedium = styled(PMedium)`
	color: ${props => props.theme.colorStyles.heading};
	text-transform: uppercase;
	margin-right: 4px;
`;
