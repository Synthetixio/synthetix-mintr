import React from 'react';
import styled from 'styled-components';
import { fontFamilies } from 'styles/themes';

interface StatBoxProps {
	subtext: string;
	content: string;
	multiple: boolean;
}

export const StatBox: React.FC<StatBoxProps> = ({ subtext, content, multiple }) => {
	return (
		<Container multiple>
			<Subtext>{subtext}</Subtext>
			<Content>{content}</Content>
		</Container>
	);
};

const Container = styled.div<any>`
	background: #020b29;
	border: 1px solid #282862;
	box-sizing: border-box;
	border-radius: 2px;
	width: 300px;
	height: 100px;
	margin: ${(props: any) => (props.multiple ? '0px 16px' : '0px')};
`;

const Subtext = styled.p`
	font-family: ${fontFamilies.regular};
	font-size: 14px;
	line-height: 16px;
	text-align: center;
	letter-spacing: 0.5px;
	color: #cacaf1;
`;

const Content = styled.p`
	font-family: ${fontFamilies.regular};
	font-size: 24px;
	line-height: 24px;
	text-align: center;
	letter-spacing: 0.2px;
	color: #ffffff;
`;
