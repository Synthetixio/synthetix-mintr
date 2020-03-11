import React, { useContext } from 'react';
import styled from 'styled-components';
import { withTranslation, useTranslation } from 'react-i18next';

import { Store } from '../../store';
import { updateCurrentTab } from '../../ducks/ui';

import { Home, Depot, Transactions, Escrow, LPRewards } from '../MintrTabs';
import { TabButton } from '../../components/Button';
import { TransactionSettingsPopup } from '../../components/Popup';

const TabRow = () => {
	const { t } = useTranslation();
	const {
		state: {
			ui: { currentTab },
		},
		dispatch,
	} = useContext(Store);
	return ['home', 'depot', 'transactionsHistory', 'escrow', 'lpRewards'].map(tab => {
		return (
			<TabButton
				key={tab}
				isSelected={tab === currentTab}
				onClick={() => updateCurrentTab(tab, dispatch)}
			>
				{/* i18next-extract-disable-next-line */}
				{t(`mainNavigation.tabs.${tab}`)}
			</TabButton>
		);
	});
};

const renderScreen = screen => {
	switch (screen) {
		case 'home':
		default:
			return <Home />;
		case 'depot':
			return <Depot />;
		case 'transactionsHistory':
			return <Transactions />;
		case 'escrow':
			return <Escrow />;
		case 'lpRewards':
			return <LPRewards />;
	}
};

const MainContainer = () => {
	const {
		state: {
			ui: { currentTab, transactionSettingsPopupIsVisible },
		},
	} = useContext(Store);

	return (
		<MainContainerWrapper>
			<Overlay isVisible={transactionSettingsPopupIsVisible}></Overlay>
			<Header>
				<TabRow />
			</Header>
			{renderScreen(currentTab)}
			{transactionSettingsPopupIsVisible ? (
				<TransactionSettingsPopup></TransactionSettingsPopup>
			) : null}
		</MainContainerWrapper>
	);
};

const MainContainerWrapper = styled('div')`
	width: 100%;
	background-color: ${props => props.theme.colorStyles.background};
	position: relative;
`;

const Header = styled('div')`
	display: flex;
	justify-content: space-between;
	height: 80px;
	background-color: ${props => props.theme.colorStyles.menu};
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

export default withTranslation()(MainContainer);
