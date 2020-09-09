import React from 'react';
import styled from 'styled-components';
import { fontFamilies } from 'styles/themes';

interface GasSettingsProps {
	currentGasPrice?: any;
}

export const GasSettings: React.FC<GasSettingsProps> = ({ currentGasPrice }) => {
	console.log(currentGasPrice);
	return (
		<GasStat>
			<StatText>
				GAS: ${currentGasPrice.price} / SPEED: ~{currentGasPrice.time} mins
			</StatText>
			<EditButton>EDIT</EditButton>
		</GasStat>
	);
};

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
