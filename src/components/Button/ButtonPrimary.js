import React from 'react';
import styled from 'styled-components';
import { ButtonPrimaryLabel, ButtonPrimaryLabelMedium } from '../Typography';

export const ButtonPrimary = ({ children, onClick, disabled, width, height, ...rest }) => {
	return (
		<Button onClick={onClick} disabled={disabled} width={width} height={height} {...rest}>
			<ButtonPrimaryLabel>{children}</ButtonPrimaryLabel>
		</Button>
	);
};

export const ButtonPrimaryMedium = ({ children, onClick, disabled }) => {
	return (
		<ButtonMedium disabled={disabled} onClick={onClick}>
			<ButtonPrimaryLabelMedium>{children}</ButtonPrimaryLabelMedium>
		</ButtonMedium>
	);
};

const Button = styled.button`
	width: ${props => (props.width ? props.width : '400px')};
	height: ${props => (props.height ? props.height : '72px')};
	border-radius: 5px;
	text-transform: uppercase;
	border: none;
	cursor: pointer;
	background-color: ${props => props.theme.colorStyles.buttonPrimaryBg};
	transition: all ease-in 0.1s;
	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	&:hover:not(:disabled) {
		background-color: ${props => props.theme.colorStyles.buttonPrimaryBgFocus};
	}
`;

const ButtonMedium = styled(Button)`
	width: 162px;
	height: 48px;
	:disabled {
		opacity: 0.4;
		pointer-events: none;
	}
`;
