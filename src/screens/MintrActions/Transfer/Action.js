import React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import { formatCurrency } from '../../../helpers/formatters';
import { SlidePage } from '../../../components/ScreenSlider';
import { ButtonPrimary, ButtonTertiary, ButtonMax } from '../../../components/Button';
import { PLarge, H1, DataHeaderLarge } from '../../../components/Typography';
import Input, { SimpleInput } from '../../../components/Input';
import TransactionPriceIndicator from '../../../components/TransactionPriceIndicator';
import ErrorMessage from '../../../components/ErrorMessage';

const Action = ({
	t,
	onDestroy,
	onSend,
	balances,
	currentCurrency,
	onCurrentCurrencyChange,
	sendAmount,
	sendDestination,
	setSendAmount,
	setSendDestination,
	isFetchingGasLimit,
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
						<ActionImage src="/images/actions/transfer.svg" big />
						<H1>{t('mintrActions.send.action.pageTitle')}</H1>
						<PLarge>{t('mintrActions.send.action.pageSubtitle')}</PLarge>
					</Intro>
					<Details>
						<Box>
							<DataHeaderLarge>{t('mintrActions.send.action.available')}</DataHeaderLarge>
							<Amount>
								{formatCurrency(currentCurrency && currentCurrency.balance) || 0}{' '}
								{currentCurrency && currentCurrency.name}
							</Amount>
						</Box>
					</Details>
				</Top>
				<Middle>
					<Form>
						<PLarge>{t('mintrActions.send.action.amountInstruction')}</PLarge>
						<Input
							disabled={!currentCurrency}
							onChange={e => setSendAmount(e.target.value)}
							onSynthChange={onCurrentCurrencyChange}
							synths={balances}
							currentSynth={currentCurrency}
							value={sendAmount}
							placeholder="0.00"
							rightComponent={
								<ButtonMax
									onClick={() => setSendAmount((currentCurrency && currentCurrency.balance) || 0)}
								/>
							}
						/>
						<ErrorMessage message={gasEstimateError} />
						<PLarge marginTop="32px">{t('mintrActions.send.action.walletInstruction')}</PLarge>
						<SimpleInput
							onChange={e => setSendDestination(e.target.value)}
							value={sendDestination}
							placeholder="e.g. 0x3b18a4..."
						/>
					</Form>
				</Middle>
				<Bottom>
					<TransactionPriceIndicator />
					<ButtonPrimary
						disabled={!sendDestination || !sendAmount || gasEstimateError || isFetchingGasLimit}
						onClick={onSend}
						margin="auto"
					>
						{t('mintrActions.send.action.buttons.send')}
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
	padding: 0 64px;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	justify-content: space-around;
`;

const Top = styled.div`
	height: auto;
	margin-bottom: -16px;
`;

const Middle = styled.div`
	height: auto;
	margin: 0px auto 16px auto;
`;

const Bottom = styled.div`
	height: auto;
	margin-bottom: 32px;
`;

const Navigation = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	padding: 20px 0;
`;

const Intro = styled.div`
	max-width: 530px;
	margin-bottom: 24px;
`;

const ActionImage = styled.img`
	height: ${props => (props.big ? '64px' : '48px')};
	width: ${props => (props.big ? '64px' : '48px')};
`;

const Details = styled.div`
	display: flex;
	margin-bottom: 32px;
`;

const Box = styled.div`
	height: auto;
	width: auto;
	padding: 16px 24px;
	margin: auto;
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 5px;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const Amount = styled.span`
	color: ${props => props.theme.colorStyles.hyperlink};
	font-family: 'apercu-medium';
	font-size: 16px;
	margin-left: 16px;
`;

const Form = styled.div`
	margin: 0px 0px 24px 0px;
	height: auto;
	display: flex;
	flex-direction: column;
`;

export default withTranslation()(Action);
