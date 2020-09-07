import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { setCurrentTab, getCurrentTab } from '../../ducks/ui';
import { getModalState } from '../../ducks/modal';

import { Home } from '../MintrTabs';
import { DelegateModal } from '../../components/Modal';
import { MODAL_TYPES_TO_KEY } from '../../constants/modal';

const MainContainer = ({ currentTab, modalState: { modalType, modalProps }, setCurrentTab }) => {
	return (
		<MainContainerWrapper>
			<Overlay isVisible={modalType}></Overlay>
			<Home />;
			{modalType === MODAL_TYPES_TO_KEY.DELEGATE ? <DelegateModal {...modalProps} /> : null}
		</MainContainerWrapper>
	);
};

const MainContainerWrapper = styled('div')`
	width: 100%;
	background-color: ${props => props.theme.colorStyles.background};
	position: relative;
`;

const Overlay = styled.div`
	visibility: ${props => (props.isVisible ? 'visible' : 'hidden')};
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgb(0, 0, 0, 0.7);
	z-index: 1000;
`;

const mapStateToProps = state => ({
	currentTab: getCurrentTab(state),
	modalState: getModalState(state),
});

const mapDispatchToProps = {
	setCurrentTab,
};

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
