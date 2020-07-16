import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';

import { useTranslation } from 'react-i18next';
import snxJSConnector from '../../helpers/snxJSConnector';

import { ButtonTertiary } from '../Button';
import { PMedium } from '../Typography';
import { NotificationSpinner } from '../Spinner';

import { hideTransaction } from '../../ducks/transactions';
import { getWalletDetails } from '../../ducks/wallet';

const StatusImage = ({ status }) => {
	if (status === 'pending') {
		return <NotificationSpinner isSmall={true} />;
	} else return <StatusImageWrapper src={'/images/success.svg'} />;
};

const getStatusSentence = status => {
	switch (status) {
		case 'pending':
		default:
			return 'notification.status.pending';
		case 'success':
			return 'notification.status.success';
		case 'error':
			return 'notification.status.error';
	}
};

const useGetTransactionTicket = transaction => {
	const [data, setData] = useState(transaction.status);

	useEffect(() => {
		const getTransactionTicket = async () => {
			const status = await snxJSConnector.utils.waitForTransaction(transaction.hash);
			setData(status ? 'success' : 'error');
			return () => setData(null);
		};
		getTransactionTicket();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return data;
};

const Notification = ({ transaction, walletDetails, hideTransaction }) => {
	const { t } = useTranslation();
	const { networkName } = walletDetails;

	const status = useGetTransactionTicket(transaction);
	return (
		<NotificationWrapper>
			<LeftBlock>
				<StatusImage status={status} />
				<InfoBlock>
					<NotificationStatus>{t(getStatusSentence(status))}</NotificationStatus>
					<NotificationInfo>{transaction.info}</NotificationInfo>
				</InfoBlock>
			</LeftBlock>
			<ButtonBlock>
				<ButtonTertiary
					href={`https://${networkName === 'mainnet' ? '' : networkName + '.'}etherscan.io/tx/${
						transaction.hash
					}`}
					as="a"
					target="_blank"
				>
					{t('button.navigation.view')}
				</ButtonTertiary>
				<ButtonTertiary onClick={() => hideTransaction(transaction.hash)}>
					{t('button.navigation.close')}
				</ButtonTertiary>
			</ButtonBlock>
		</NotificationWrapper>
	);
};

const StatusImageWrapper = styled.img`
	width: 40px;
	height: 40px;
	margin-right: 10px;
`;

const LeftBlock = styled.div`
	display: flex;
	align-items: center;
`;

const InfoBlock = styled.div`
	display: flex;
	flex-direction: column;
`;

const NotificationStatus = styled(PMedium)`
	font-family: ${props => props.theme.fontFamilies.medium};
	line-height: 5px;
	letter-spacing: 0.44px;
	margin-top: 0;
`;

const NotificationInfo = styled.p`
	font-family: ${props => props.theme.fontFamilies.medium};
	font-size: 12px;
	color: ${props => props.theme.colorStyles.tableBody};
	letter-spacing: 0.15px;
	margin: 0;
`;

const ButtonBlock = styled.div`
	display: flex;
	& > :last-child {
		margin-left: 10px;
	}
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const NotificationWrapper = styled.div`
	animation: ${fadeIn} 1s linear both;
	width: 560px;
	height: 72px;
	background-color: ${props => props.theme.colorStyles.panels};
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 5px;
	box-shadow: 0 4px 11px -3px #a59fb7;
	padding: 16px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	&:not(:last-child) {
		margin-bottom: 20px;
	}
`;

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
});

const mapDispatchToProps = {
	hideTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
