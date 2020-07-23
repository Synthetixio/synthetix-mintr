import React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import { SlidePage } from '../../../components/ScreenSlider';
import { formatCurrency } from '../../../helpers/formatters';

import { ButtonPrimary, ButtonTertiary, ButtonMax } from '../../../components/Button';
import { PLarge, H1 } from '../../../components/Typography';
import Input from '../../../components/Input';
import TransactionPriceIndicator from '../../../components/TransactionPriceIndicator';
import ErrorMessage from '../../../components/ErrorMessage';

const Action = ({
	t,
	onDestroy,
	onDeposit,
	onUnlock,
	sUSDBalance,
	gasEstimateError,
	isFetchingGasLimit,
	setDepositAmount,
	depositAmount,
	hasAllowance,
	gasLimit,
}) => {
	return (
		<SlidePage>
			<Container>
				<Navigation>
					<ButtonTertiary onClick={onDestroy}>{t('button.navigation.cancel')}</ButtonTertiary>
				</Navigation>
				<Top>
					<Intro>
						<ActionImage src="/images/actions/deposit.svg" />
						<H1>{t('depot.deposit.action.title')}</H1>
						<PLarge>{t('depot.deposit.action.subtitle')}</PLarge>
						<Amount>${formatCurrency(sUSDBalance)}</Amount>
					</Intro>
					<Form>
						<PLarge>{t('depot.deposit.action.instruction')}</PLarge>
						<Input
							isDisabled={!hasAllowance}
							singleSynth={'sUSD'}
							onChange={e => setDepositAmount(e.target.value)}
							value={depositAmount}
							placeholder="0.00"
							rightComponent={
								<ButtonMax
									onClick={() => {
										setDepositAmount(sUSDBalance);
									}}
								/>
							}
						/>
						<ErrorMessage message={gasEstimateError} />
					</Form>
				</Top>
				<Bottom>
					<TransactionPriceIndicator
						isFetchingGasLimit={isFetchingGasLimit}
						gasLimit={gasLimit}
						style={{ margin: '0' }}
					/>
					{hasAllowance ? (
						<ButtonPrimary
							disabled={isFetchingGasLimit || gasEstimateError || !depositAmount}
							onClick={onDeposit}
						>
							{t('depot.deposit.action.buttons.deposit')}
						</ButtonPrimary>
					) : (
						<ButtonPrimary onClick={onUnlock}>
							{t('depot.deposit.action.buttons.unlock')}
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
	padding: 40px 64px;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	justify-content: space-around;
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
	text-align: left;
`;

const Intro = styled.div`
	max-width: 380px;
	margin-bottom: 64px;
`;

const ActionImage = styled.img`
	height: 64px;
	width: 64px;
	margin-bottom: 8px;
`;

const Amount = styled.span`
	color: ${props => props.theme.colorStyles.body};
	font-family: 'apercu-medium';
	font-size: 24px;
	margin: 8px 0px 0px 0px;
`;

const Form = styled.div`
	margin: 0px 0px 80px 0px;
`;

export default withTranslation()(Action);
