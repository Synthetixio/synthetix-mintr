import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { SlidePage } from '../../../components/ScreenSlider';
import { withTranslation } from 'react-i18next';

import { ButtonPrimary, ButtonTertiary } from '../../../components/Button';
import { PLarge, H1, HyperlinkSmall } from '../../../components/Typography';
import TransactionPriceIndicator from '../../../components/TransactionPriceIndicator';
import Input from '../../../components/Input';
import ErrorMessage from '../../../components/ErrorMessage';

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
								Burn Max
							</AmountButton>
							<AmountButton width="66%">Fix your Collaterization Ratio</AmountButton>
						</ButtonRow>
						<Input
							singleSynth={'sUSD'}
							onChange={e => setBurnAmount(e.target.value)}
							value={burnAmount}
							placeholder="0.00"
						/>
						{/* <RatioError>To fix your C-Ratio, buy 1000.00 sUSD on Uniswap or sX</RatioError> */}
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
					<ButtonPrimary
						disabled={isFetchingGasLimit || gasEstimateError}
						onClick={onBurn}
						margin="auto"
					>
						{t('mintrActions.burn.action.buttons.burn')}
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

const Form = styled.div``;

const ButtonToggleInput = styled.button`
	border: none;
	margin: 30px 0;
	cursor: pointer;
	background-color: transparent;
`;

const ButtonRow = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	margin-bottom: 16px;
`;

const AmountButton = styled.div`
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

// const MaxButton = styled.button`
// 	padding: 8px 4px;
// 	width: 30%;
// 	border: 1px solid ${props => props.theme.colorStyles.borders};
// 	border-radius: 3px;
// 	color: #fff;
// 	font-family: 'apercu-medium';
// 	font-size: 16px;
// 	background-color: ${props => props.theme.colorStyles.buttonPrimaryBg};
// 	cursor: pointer;
// `;

// const RatioButton = styled.button`
// 	padding: 8px 4px;
// 	width: 66%;
// 	border: 1px solid ${props => props.theme.colorStyles.borders};
// 	border-radius: 3px;
// 	color: #fff;
// 	font-family: 'apercu-medium';
// 	font-size: 16px;
// 	background-color: ${props => props.theme.colorStyles.buttonPrimaryBg};
// 	cursor: pointer;
// `;

// const RatioError = styled.div`
// 	background-color: ${props => props.theme.colorStyles.accentLight};
// 	color: ${props => props.theme.colorStyles.heading};
// 	border-radius: 4px;
// 	padding: 8px 16px;
// 	margin-top: 8px;
// `;

export default withTranslation()(Action);
