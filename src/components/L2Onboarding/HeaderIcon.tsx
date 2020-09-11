import React from 'react';
import { fontFamilies } from 'styles/themes';
import styled from 'styled-components';

interface HeaderIconProps {
	icon: any;
	title: string;
	subtext: string;
}

export const HeaderIcon: React.FC<HeaderIconProps> = ({ icon, title, subtext }) => {
	return (
		<>
			<Icon>{icon}</Icon>
			<Header>{title}</Header>
			<Subtext>{subtext}</Subtext>
		</>
	);
};

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
	width: 600px;
	height: 100px;
`;

const Icon = styled.div`
	min-height: 100px;
	max-height: 100px;
	margin-bottom: 16px;
`;
