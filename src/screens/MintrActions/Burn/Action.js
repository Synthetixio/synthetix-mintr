import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { SlidePage } from '../../../components/ScreenSlider';
import { withTranslation } from 'react-i18next';

import { ButtonPrimary, ButtonTertiary } from '../../../components/Button';
import { PLarge, H1, HyperlinkSmall, Subtext } from '../../../components/Typography';
import TransactionPriceIndicator from '../../../components/TransactionPriceIndicator';
import Input from '../../../components/Input';
import ErrorMessage from '../../../components/ErrorMessage';
import { formatCurrency, secondsToTime } from '../../../helpers/formatters';

const Action = ({
	t,
	onDestroy,
	onBurn,
	maxBurnAmount,
	burnAmount,
	setBurnAmount,
	transferableAmount,
	setTransferableAmount,
	isFetchingGasLimit,
	gasEstimateError,
	burnAmountToFixCRatio,
	waitingPeriod,
	onWaitingPeriodCheck,
}) => {
	const [snxInputIsVisible, toggleSnxInput] = useState(false);
	return (
		<SlidePage>
			<Container>
				<Navigation>
					<ButtonTertiary onClick={onDestroy}>{t('button.navigation.cancel')}</ButtonTertiary>
				</Navigation>
				<Top>
					<Intro>
						<ActionImage src="/images/actions/burn.svg" big />
						<H1>{t('mintrActions.burn.action.title')}</H1>
						<PLarge>{t('mintrActions.burn.action.subtitle')}</PLarge>
					</Intro>
					<Form>
						<PLarge>{t('mintrActions.burn.action.instruction')}</PLarge>
						<ButtonRow>
							<AmountButton
								onClick={() => {
									setBurnAmount(maxBurnAmount);
								}}
								width="30%"
							>
								{t('button.burnMax')}
							</AmountButton>
							<AmountButton
								onClick={() => {
									setBurnAmount(burnAmountToFixCRatio);
								}}
								width="66%"
							>
								{t('button.fixCRatio')}
							</AmountButton>
						</ButtonRow>
						<SubtextRow>
							<Subtext>${formatCurrency(maxBurnAmount)}</Subtext>
							<Subtext>${formatCurrency(burnAmountToFixCRatio)}</Subtext>
						</SubtextRow>
						<Input
							singleSynth={'sUSD'}
							onChange={e => setBurnAmount(e.target.value)}
							value={burnAmount}
							placeholder="0.00"
						/>
						<ErrorMessage message={gasEstimateError} />
						{snxInputIsVisible ? (
							<Fragment>
								<PLarge>{t('mintrActions.burn.action.transferrable.title')}</PLarge>
								<Input
									singleSynth={'SNX'}
									onChange={e => setTransferableAmount(e.target.value)}
									value={transferableAmount}
									placeholder="0.00"
								/>
							</Fragment>
						) : (
							<ButtonToggleInput onClick={() => toggleSnxInput(true)}>
								<HyperlinkSmall>
									{t('mintrActions.burn.action.transferrable.button')}
								</HyperlinkSmall>
							</ButtonToggleInput>
						)}
					</Form>
				</Top>
				<Bottom>
					<TransactionPriceIndicator />
					{waitingPeriod ? (
						<RetryButtonWrapper>
							<ButtonPrimary onClick={onWaitingPeriodCheck} margin="auto">
								Retry
							</ButtonPrimary>
							<Subtext style={{ position: 'absolute', fontSize: '12px' }}>
								There is a waiting period after completing a trade. Please wait approximately{' '}
								{secondsToTime(waitingPeriod)} before attempting to burn Synths.
							</Subtext>
						</RetryButtonWrapper>
					) : (
						<ButtonPrimary
							disabled={isFetchingGasLimit || gasEstimateError}
							onClick={onBurn}
							margin="auto"
						>
							{t('mintrActions.burn.action.buttons.burn')}
						</ButtonPrimary>
					)}
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
	padding: 16px 64px;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	justify-content: space-between;
`;

const Top = styled.div`
	height: auto;
`;

const Bottom = styled.div`
	height: auto;
	margin-bottom: 64px;
`;

const Navigation = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	padding: 20px 0;
`;

const Intro = styled.div`
	max-width: 380px;
	margin-bottom: 24px;
`;

const ActionImage = styled.img`
	height: ${props => (props.big ? '64px' : '48px')};
	width: ${props => (props.big ? '64px' : '48px')};
	margin-bottom: 8px;
`;

const Form = styled.div`
	width: 400px;
`;

const ButtonToggleInput = styled.button`
	border: none;
	margin: 10px 0;
	cursor: pointer;
	background-color: transparent;
`;

const ButtonRow = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
`;

const SubtextRow = styled.div`
	display: flex;
	justify-content: space-between;
`;

const AmountButton = styled.button`
	padding: 8px 4px;
	width: ${props => (props.width ? props.width : '100%')}
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 3px;
	color: ${props => props.theme.colorStyles.buttonPrimaryText};
	font-family: 'apercu-medium';
	font-size: 16px;
	background-color: ${props => props.theme.colorStyles.buttonPrimaryBg};
	cursor: pointer;
	white-space: no-wrap;
`;

const RetryButtonWrapper = styled.div`
	position: relative;
`;

export default withTranslation()(Action);
