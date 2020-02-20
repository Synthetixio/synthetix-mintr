import React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import { SlidePage } from '../../../components/ScreenSlider';
import TransactionPriceIndicator from '../../../components/TransactionPriceIndicator';
import { ButtonPrimary, ButtonTertiary, ButtonMax } from '../../../components/Button';
import { PLarge, H1, Subtext } from '../../../components/Typography';
import Input from '../../../components/Input';
import ErrorMessage from '../../../components/ErrorMessage';
import { secondsToTime } from '../../../helpers/formatters';

const Action = ({
	t,
	onDestroy,
	synthBalances,
	baseSynth,
	onTrade,
	onBaseSynthChange,
	baseAmount,
	quoteAmount,
	setBaseAmount,
	setQuoteAmount,
	isFetchingGasLimit,
	gasEstimateError,
	waitingPeriod,
	onWaitingPeriodCheck,
}) => {
	const onBaseAmountChange = amount => {
		setBaseAmount(amount);
		setQuoteAmount(Number(amount) ? Number(amount) * Number(baseSynth.rate) : '');
	};

	const onQuoteAmountChange = amount => {
		setQuoteAmount(amount);
		setBaseAmount(Number(amount) ? Number(amount) / Number(baseSynth.rate) : '');
	};

	return (
		<SlidePage>
			<Container>
				<Navigation>
					<ButtonTertiary onClick={onDestroy}>{t('button.navigation.cancel')}</ButtonTertiary>
					<ButtonTertiary as="a" target="_blank" href="https://synthetix.exchange">
						{t('mintrActions.trade.action.buttons.exchange')}↗
					</ButtonTertiary>
				</Navigation>
				<Inner>
					<Top>
						<Intro>
							<ActionImage src="/images/actions/trade.svg" big />
							<H1>{t('mintrActions.trade.action.title')}</H1>
							<PLarge>{t('mintrActions.trade.action.subtitle')}</PLarge>
						</Intro>
						<Form>
							<Input
								isDisabled={!synthBalances}
								synths={synthBalances}
								onSynthChange={onBaseSynthChange}
								value={baseAmount}
								onChange={e => onBaseAmountChange(e.target.value)}
								placeholder="0.00"
								currentSynth={baseSynth}
								rightComponent={<ButtonMax onClick={() => onBaseAmountChange(baseSynth.balance)} />}
							/>
							<ErrorMessage message={gasEstimateError} />
							<PLarge>↓</PLarge>
							<Input
								isDisabled={!synthBalances}
								singleSynth={'sUSD'}
								placeholder="0.00"
								value={quoteAmount}
								onChange={e => onQuoteAmountChange(e.target.value)}
							/>
						</Form>
					</Top>
					<Bottom>
						<Subtext>{t('network.tradingFee')} 0.3%</Subtext>
						{/* <Subtext>RATE: 1.00 sUSD = 0.00004 sBTC </Subtext> */}
						<TransactionPriceIndicator margin="8px 0" />
						{waitingPeriod ? (
							<RetryButtonWrapper>
								<ButtonPrimary onClick={onWaitingPeriodCheck} margin="auto">
									Retry
								</ButtonPrimary>
								<Subtext style={{ position: 'absolute', fontSize: '12px' }}>
									There is a waiting period after completing a trade. Please wait approximately{' '}
									{secondsToTime(waitingPeriod)} before attempting to trade Synths.
								</Subtext>
							</RetryButtonWrapper>
						) : (
							<ButtonPrimary
								disabled={isFetchingGasLimit || gasEstimateError}
								onClick={onTrade}
								margin="auto"
							>
								{t('mintrActions.trade.action.buttons.trade')}
							</ButtonPrimary>
						)}
					</Bottom>
				</Inner>
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
`;

const Inner = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	justify-content: center;
`;

const Top = styled.div`
	height: auto;
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
	margin-bottom: 48px;
`;

const ActionImage = styled.img`
	height: ${props => (props.big ? '64px' : '48px')};
	width: ${props => (props.big ? '64px' : '48px')};
	margin-bottom: 8px;
`;

const Form = styled.div`
	margin: 0px auto 24px auto;
	width: 400px;
`;

const RetryButtonWrapper = styled.div`
	position: relative;
`;

export default withTranslation()(Action);
