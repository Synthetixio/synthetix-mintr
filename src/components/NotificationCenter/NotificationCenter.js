import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getCurrentTransactions } from '../../ducks/transactions';

import Notification from './TransactionNotification';

const NotificationCenter = ({ currentTransactions }) => {
	if (!currentTransactions) return null;
	return (
		<NotificationCenterWrapper>
			{currentTransactions.reverse().map(transaction => {
				if (transaction.hasNotification) {
					return <Notification key={transaction.hash} transaction={transaction} />;
				}
				return null;
			})}
		</NotificationCenterWrapper>
	);
};

const NotificationCenterWrapper = styled.div`
	position: fixed;
	right: 20px;
	bottom: calc(100% - 100vh + 20px);
	z-index: 100;
`;

const mapStateToProps = state => ({
	currentTransactions: getCurrentTransactions(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationCenter);
