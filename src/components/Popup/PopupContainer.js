import React from 'react';
import styled from 'styled-components';
import { Cross } from '../Icons';

const Popup = ({ children, handleClose }) => {
	return (
		<PopupWrapper>
			<Nav>
				<ButtonClose onClick={handleClose}>
					<Cross />
				</ButtonClose>
			</Nav>
			{children}
		</PopupWrapper>
	);
};

const PopupWrapper = styled.div`
	position: absolute;
	left: 50%;
	top: 50vh;
	transform: translate(-50%, -50%);
	z-index: 1001;
`;

const Nav = styled.div`
	position: relative;
	display: flex;
	flex-direction: row-reverse;
	top: 80px;
	right: 40px;
`;

const ButtonClose = styled.button`
	cursor: pointer;
	background-color: transparent;
	border: none;
`;

export default Popup;
