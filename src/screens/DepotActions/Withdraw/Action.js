import React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import { formatCurrency } from '../../../helpers/formatters';
import { SlidePage } from '../../../components/ScreenSlider';

import { ButtonPrimary, ButtonTertiary } from '../../../components/Button';
import { PLarge, H1 } from '../../../components/Typography';

import TransactionPriceIndicator from '../../../components/TransactionPriceIndicator';
import ErrorMessage from '../../../components/ErrorMessage';

const Action = ({
	t,
	onDestroy,
	onWithdraw,
	amountAvailable,
	isFetchingGasLimit,
	gasLimit,
	gasEstimateError,
}) => {
	return (
		<SlidePage>
			<Container>
				<Navigation>
					<ButtonTertiary onClick={onDestroy}>{t('button.navigation.cancel')}</ButtonTertiary>
				</Navigation>
				<Top>
					<Intro>
						<ActionImage src="/images/actions/withdraw.svg" />
						<H1>{t('depot.withdraw.action.title')}</H1>
						<PLarge>{t('depot.withdraw.action.subtitle')}</PLarge>
						<Amount>{formatCurrency(amountAvailable)}sUSD</Amount>
					</Intro>
					<ErrorMessage message={gasEstimateError} />
				</Top>
				<Bottom>
					<TransactionPriceIndicator isFetchingGasLimit={isFetchingGasLimit} gasLimit={gasLimit} />
					<ButtonPrimary
						// disabled={isFetchingGasLimit || gasEstimateError || !amountAvailable}
						onClick={onWithdraw}
						margin="auto"
					>
						{t('depot.withdraw.action.buttons.withdraw')}
					</ButtonPrimary>
				</Bottom>
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

const Top = styled.div`
	width: 100%;
	margin: 0 auto 80px auto;
`;

const Bottom = styled.div`
	margin-bottom: 40px;
`;

const Navigation = styled.div`
	width: 100%;
	display: flex;
	text-align: left;
`;

const Intro = styled.div`
	margin-bottom: 64px;
`;

const ActionImage = styled.img`
	height: 48px;
	width: 48px;
	margin-bottom: 8px;
`;

const Amount = styled.span`
	color: ${props => props.theme.colorStyles.body};
	font-family: 'apercu-medium';
	font-size: 24px;
	margin: 8px 0px 0px 0px;
`;

export default withTranslation()(Action);
