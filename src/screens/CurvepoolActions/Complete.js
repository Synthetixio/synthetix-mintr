import React, { Fragment } from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import { formatCurrency } from '../../helpers/formatters';

import { SlidePage } from '../../components/ScreenSlider';
import { ButtonPrimary } from '../../components/Button';
import { PLarge, PageTitle, DataHeaderLarge } from '../../components/Typography';

const Success = ({ t, onDestroy, amount, label }) => {
	return (
		<Fragment>
			<Top>
				<Intro>
					<ActionImage src="/images/success.svg" big />
					<PageTitle>{t('lpRewards.shared.unlocked.complete')}</PageTitle>
					<PLarge>{t('transactionProcessing.complete.subtitle')}</PLarge>
				</Intro>
				<Details>
					<Box>
						<DataHeaderLarge>{label}</DataHeaderLarge>
						<Amount>{amount}</Amount>
					</Box>
				</Details>
			</Top>
			<Bottom>
				<Buttons>
					<ButtonPrimary onClick={onDestroy}>{t('button.navigation.ok')}</ButtonPrimary>
				</Buttons>
			</Bottom>
		</Fragment>
	);
};

const Failure = ({ t, transactionError, onDestroy }) => {
	return (
		<Fragment>
			<Top>
				<Intro>
					<ActionImage src="/images/failure.svg" big />
					<PageTitle>{t('transactionProcessing.error.title')}</PageTitle>
					{transactionError.code ? (
						<PLarge>
							{t('transactionProcessing.error.subtitle')} {transactionError.code}
						</PLarge>
					) : null}
					<PLarge>{t(transactionError.message)}</PLarge>
				</Intro>
			</Top>
			<Bottom>
				<Buttons>
					<ButtonPrimary onClick={onDestroy}>{t('button.navigation.ok')}</ButtonPrimary>
				</Buttons>
			</Bottom>
		</Fragment>
	);
};

const Complete = props => {
	return (
		<SlidePage>
			<Container>
				{props && props.transactionError ? <Failure {...props} /> : <Success {...props} />}
			</Container>
		</SlidePage>
	);
};

const Container = styled.div`
	width: 100%;
	height: 850px;
	max-width: 720px;
	margin: 0 auto;
	overflow: hidden;
	background-color: ${props => props.theme.colorStyles.panels};
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 5px;
	box-shadow: 0px 5px 10px 5px ${props => props.theme.colorStyles.shadow1};
	margin-bottom: 20px;
	padding: 40px 64px;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	justify-content: space-around;
`;

const Intro = styled.div`
	max-width: 530px;
	margin-top: 24px;
	margin-bottom: 48px;
`;

const ActionImage = styled.img`
	height: ${props => (props.big ? '64px' : '48px')};
	width: ${props => (props.big ? '64px' : '48px')};
	margin-bottom: 24px;
`;

const Details = styled.div`
	display: flex;
	justify-content: center;
	margin-bottom: 48px;
`;

const Box = styled.div`
	height: auto;
	width: auto;
	padding: 24px 40px;
	margin: 0px 16px;
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 2px;
	display: flex;
	flex-direction: column;
`;

const Amount = styled.span`
	color: ${props => props.theme.colorStyles.hyperlink};
	font-family: 'apercu-medium';
	font-size: 24px;
	margin: 16px 0px 0px 0px;
`;

const Buttons = styled.div`
	height: auto;
	& > :last-child {
		margin-top: 24px;
	}
`;

const Top = styled.div`
	height: auto;
`;

const Bottom = styled.div`
	height: auto;
	margin-bottom: 32px;
`;

export default withTranslation()(Complete);
