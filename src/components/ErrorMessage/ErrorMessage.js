import React from 'react';
import styled from 'styled-components';

const ErrorMessage = ({ message = null }) => {
	if (!message) return null;
	return <Container visible={!!message}>{message}</Container>;
};

const Container = styled.div`
	opacity: ${props => (props.visible ? 1 : 0)};
	width: 100%;
	display: flex;
	align-items: center;
	padding: 10px 15px;
	transition: opacity 0.2s ease-in-out;
	background-color: ${props => props.theme.colorStyles.errorMessageBackground};
	color: ${props => props.theme.colorStyles.errorMessageColor};
	border-radius: 3px;
	margin: 10px 0;
`;

export default ErrorMessage;
