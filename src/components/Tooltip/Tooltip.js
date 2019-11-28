import React, { useState } from 'react';
import styled from 'styled-components';
import { Info } from '../Icons';
import { DataLarge } from '../Typography';

const Tooltip = ({ content, width }) => {
	const [isVisible, setIsVisible] = useState(false);
	return (
		<Container>
			<IconContainer
				onMouseEnter={() => setIsVisible(true)}
				onMouseLeave={() => setIsVisible(false)}
			>
				<Info />
			</IconContainer>
			<Popup isVisible={isVisible} width={width}>
				<DataLarge>{content}</DataLarge>
			</Popup>
		</Container>
	);
};

const Container = styled.div`
	position: relative;
	z-index: 1000;
	cursor: pointer;
	overflow: visible;
`;

const IconContainer = styled.div`
	width: 23px;
	height: 23px;
`;

const Popup = styled.div`
	pointer-events: none;
	text-align: left;
	opacity: ${props => (props.isVisible ? 1 : 0)};
	transition: opacity 0.2s ease-in-out;
	position: absolute;
	background-color: ${props => props.theme.colorStyles.panels};
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: ${props => (props.curved ? '40px' : '5px')};
	padding: 10px;
	top: calc(-10px);
	width: ${props => (props.width ? props.width : '300px')};
	transform: translateY(-100%);
	:after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 11px;
		width: 0;
		height: 0;
		border: 7px solid transparent;
		border-top-color: ${props => props.theme.colorStyles.borders};
		border-bottom: 0;
		margin-left: -7px;
		margin-bottom: -7px;
	}
`;

export default Tooltip;
