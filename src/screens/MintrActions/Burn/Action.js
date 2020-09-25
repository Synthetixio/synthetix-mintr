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
	gasLimit,
	burnAmountToFixCRatio,
	waitingPeriod,
	onWaitingPeriodCheck,
	issuanceDelay,
	onIssuanceDelayCheck,
	sUSDBalance,
}) => {
	const renderSubmitButton = () => {
		if (issuanceDelay) {
			return (
				<RetryButtonWrapper>
					<ButtonPrimary
						onClick={() => {
							onIssuanceDelayCheck();
							if (waitingPeriod) {
								onWaitingPeriodCheck();
							}
						}}
						margin="auto"
					>
						Retry
					</ButtonPrimary>
					<Subtext style={{ position: 'absolute', fontSize: '12px' }}>
						There is a waiting period after minting before you can burn. Please wait{' '}
						{secondsToTime(issuanceDelay)} before attempting to burn sUSD.
					</Subtext>
				</RetryButtonWrapper>
			);
		} else if (waitingPeriod) {
			return (
				<RetryButtonWrapper>
					<ButtonPrimary onClick={onWaitingPeriodCheck} margin="auto">
						Retry
					</ButtonPrimary>
					<Subtext style={{ position: 'absolute', fontSize: '12px' }}>
						There is a waiting period after completing a trade. Please wait{' '}
						{secondsToTime(waitingPeriod)} before attempting to burn sUSD.
					</Subtext>
				</RetryButtonWrapper>
			);
		} else {
			return (
				<ButtonPrimary
					disabled={isFetchingGasLimit || gasEstimateError || sUSDBalance === 0}
					onClick={onBurn}
					margin="auto"
				>
					{t('mintrActions.burn.action.buttons.burn')}
				</ButtonPrimary>
			);
		}
	};

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
						<StyledH1>{t('mintrActions.burn.action.title')}</StyledH1>
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
								disabled={
									maxBurnAmount === 0 ||
									burnAmountToFixCRatio === 0 ||
									burnAmountToFixCRatio > maxBurnAmount
								}
								onClick={() => {
									setBurnAmount(burnAmountToFixCRatio);
									onBurn({ burnToTarget: true });
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
									currency="SNX"
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
					<TransactionPriceIndicator isFetchingGasLimit={isFetchingGasLimit} gasLimit={gasLimit} />
					{renderSubmitButton()}
				</Bottom>
			</Container>
		</SlidePage>
	);
};

const Container = styled.div`
	width: 100%;
	height: 850px;
	max-width: 720px;
	overflow-y: auto;
	margin: 0 auto;
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

const StyledH1 = styled(H1)`
	margin-top: 0;
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
	padding: 20px 0 0 0;
`;

const Intro = styled.div`
	max-width: 380px;
	margin-bottom: 24px;
`;

const ActionImage = styled.img`
	height: 164px;
	width: 164px;
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
	background: linear-gradient(130.52deg, #f49e25 -8.54%, #b252e9 101.04%);
	cursor: pointer;
	white-space: no-wrap;
	&:hover:not(:disabled) {
		background: linear-gradient(130.52deg, #f4c625 -8.54%, #e652e9 101.04%);
	}
	&:disabled {
		opacity: 0.5;
		pointer-events: none;
	}
`;

const RetryButtonWrapper = styled.div`
	position: relative;
`;

export default withTranslation()(Action);
