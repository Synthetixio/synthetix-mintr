import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';

import { NotificationSpinner } from '../Spinner';
import { ButtonTertiary } from '../Button';
import { PMedium } from '../Typography';

const Notification = ({ isPending, icon, heading, description, link, linkLabel, onClose }) => {
	const { t } = useTranslation();
	return (
		<NotificationWrapper>
			<LeftBlock>
				{isPending ? <NotificationSpinner isSmall={true} /> : <StatusImageWrapper src={icon} />}
				<InfoBlock>
					<NotificationHeading>{heading}</NotificationHeading>
					<NotificationDescription>{description}</NotificationDescription>
				</InfoBlock>
			</LeftBlock>
			<ButtonBlock>
				<ButtonTertiary href={link} as="a" target="_blank">
					{linkLabel}
				</ButtonTertiary>
				<ButtonTertiary onClick={onClose}>{t('button.navigation.close')}</ButtonTertiary>
			</ButtonBlock>
		</NotificationWrapper>
	);
};

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

const LeftBlock = styled.div`
	display: flex;
	align-items: center;
`;

const InfoBlock = styled.div`
	display: flex;
	flex-direction: column;
`;

const NotificationHeading = styled(PMedium)`
	font-family: ${props => props.theme.fontFamilies.medium};
	line-height: 5px;
	letter-spacing: 0.44px;
	margin-top: 0;
`;

const NotificationDescription = styled.p`
	font-family: ${props => props.theme.fontFamilies.medium};
	font-size: 12px;
	color: ${props => props.theme.colorStyles.tableBody};
	letter-spacing: 0.15px;
	margin: 0;
`;

const StatusImageWrapper = styled.img`
	width: 40px;
	height: 40px;
	margin-right: 10px;
`;

export default Notification;
