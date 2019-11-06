import React from 'react';
import styled from 'styled-components';
import { Arrow } from '../../components/Icons';

const Paginator = ({ currentIndex, disabled, onIndexChange }) => {
	return (
		<Wrapper disabled={disabled}>
			<Button
				onClick={() => {
					if (currentIndex > 0) {
						onIndexChange(currentIndex - 1);
					}
				}}
			>
				<Arrow direction="left" />
			</Button>
			<Button
				onClick={() => {
					onIndexChange(currentIndex + 1);
				}}
			>
				<Arrow direction="right" />
			</Button>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	width: 100%;
	margin: 30px 0;
	display: flex;
	justify-content: center;
	& > :first-child,
	& > :last-child {
		margin: 0 20px;
	}
	transition: opacity 0.1s ease-out;
	opacity: ${props => (props.disabled ? 0.6 : 1)};
	pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
`;

const Button = styled.button`
	border: none;
	width: 24px;
	height: 24px;
	border-radius: 5px;
	background-color: ${props =>
		props.active
			? props.theme.colorStyles.paginatorButtonBackgroundActive
			: props.theme.colorStyles.paginatorButtonBackground};
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	margin: 0 5px;
	font-family: 'apercu-medium';
	font-size: 14px;
	line-height: 25px;
	font-weight: 500;
	transition: all 0.1s ease;
	color: ${props =>
		props.active ? props.theme.colorStyles.heading : props.theme.colorStyles.subtext};
	:hover {
		color: ${props => props.theme.colorStyles.heading};
		background-color: ${props =>
			props.active
				? props.theme.colorStyles.paginatorButtonBackgroundActive
				: props.theme.colorStyles.paginatorButtonBackgroundHover};
	}
`;

export default Paginator;
