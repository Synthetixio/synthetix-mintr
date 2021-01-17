import React from 'react';
import styled from 'styled-components';
import { ButtonSecondaryLabel } from '../Typography';

const ButtonSecondary = ({
	children,
	onClick,
	as = 'button',
	href = undefined,
	target = undefined,
	width,
	height,
}) => {
	return (
		<Button height={height} width={width} target={target} href={href} as={as} onClick={onClick}>
			<GradientText>{children}</GradientText>
		</Button>
	);
};

// eslint-disable-line
const Button = styled.button`
	width: ${props => (props.width ? props.width : '400px')};
	text-decoration: none;
	display: flex;
	justify-content: center;
	align-items: center;
	height: ${props => (props.height ? props.height : '72px')};
	border-radius: 5px;
	border: solid 3px transparent;
	background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
		linear-gradient(130.52deg, #f49e25 -8.54%, #b252e9 101.04%);
	background-origin: border-box;
	background-clip: content-box, border-box;
	box-shadow: 2px 1000px 1px ${props => props.theme.colorStyles.panels} inset;
	text-transform: uppercase;
	/* border: 2px solid ${props => props.theme.colorStyles.buttonPrimaryBg}; */
	cursor: pointer;
	background-color: transparent;
	transition: all ease-in 0.1s;
	&:hover {
		background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
			linear-gradient(130.52deg, #f4c625 -8.54%, #e652e9 101.04%);
	}
`;

// eslint-disable-line
const GradientText = styled(ButtonSecondaryLabel)`
	background: linear-gradient(130.52deg, #f49e25 -8.54%, #b252e9 101.04%);
	background-clip: text;
	background-size: 100%;
	background-repeat: repeat;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	-moz-background-clip: text;
	-moz-text-fill-color: transparent;
`;

export default ButtonSecondary;
