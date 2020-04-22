import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Cross } from '../Icons';

import { hideModal } from '../../ducks/modal';

const Modal = ({ children, hideModal }) => {
	return (
		<ModalWrapper>
			<Nav>
				<ButtonClose onClick={() => hideModal()}>
					<Cross />
				</ButtonClose>
			</Nav>
			{children}
		</ModalWrapper>
	);
};

const ModalWrapper = styled.div`
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

const mapDispatchToProps = {
	hideModal,
};

export default connect(null, mapDispatchToProps)(Modal);
