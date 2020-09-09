import React from 'react';
import styled from 'styled-components';
import { fontFamilies } from 'styles/themes';

interface StatBoxProps {
	subtext: string;
	content: string;
	multiple: boolean;
	tokenName: string;
}

export const StatBox: React.FC<StatBoxProps> = ({ subtext, content, multiple, tokenName }) => {
	return (
		<Container multiple>
			<Subtext>{subtext}</Subtext>
			<Flex>
				<Content>{content}</Content>
				<Token>{tokenName}</Token>
			</Flex>
		</Container>
	);
};

const Container = styled.div<any>`
	background: #020b29;
	border: 1px solid #282862;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
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
	white-space: nowrap;
	max-width: 200px;
	margin: 8px 0px;
	overflow: scroll;
	::-webkit-scrollbar {
		width: 0px; /* Remove scrollbar space */
		background: transparent; /* Optional: just make scrollbar invisible */
	}
`;

const Token = styled.p`
	font-family: ${fontFamilies.regular};
	font-size: 24px;
	line-height: 24px;
	text-align: center;
	letter-spacing: 0.2px;
	color: #ffffff;
	width: 50px;
	margin: 8px;
`;

const Flex = styled.div`
	display: flex;
	width: 100%;
	justify-content: center;
`;
