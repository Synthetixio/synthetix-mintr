import React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import { SlidePage } from '../../../components/ScreenSlider';
import TransactionPriceIndicator from '../../../components/TransactionPriceIndicator';
import { ButtonPrimary, ButtonTertiary, ButtonMax } from '../../../components/Button';
import { PLarge, H1, Subtext } from '../../../components/Typography';
import Input from '../../../components/Input';
import ErrorMessage from '../../../components/ErrorMessage';
import { getStakingAmount, estimateCRatio } from './mint-helpers';

const Action = ({
	t,
	onDestroy,
	onMint,
	issuableSynths,
	mintAmount,
	setMintAmount,
	isFetchingGasLimit,
	gasEstimateError,
	issuanceRatio,
	SNXPrice,
	debtBalance,
	snxBalance,
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
						<ActionImage src="/images/actions/mint.svg" big />
						<H1>{t('mintrActions.mint.action.title')}</H1>
						<PLarge>{t('mintrActions.mint.action.subtitle')}</PLarge>
					</Intro>

					<Form>
						<PLarge>{t('mintrActions.mint.action.instruction')}</PLarge>
						<Input
							singleSynth={'sUSD'}
							onChange={e => setMintAmount(e.target.value)}
							value={mintAmount}
							placeholder="0.00"
							rightComponent={
								<ButtonMax
									onClick={() => {
										setMintAmount(issuableSynths);
									}}
								/>
							}
						/>
						<ErrorMessage message={gasEstimateError} />
					</Form>
					<InfoRow>
						<InfoCol>
							<Subtext mr={'10px'}>{t('mintrActions.mint.action.staking')}:</Subtext>
							<Subtext>
								{getStakingAmount({
									issuanceRatio,
									mintAmount,
									SNXPrice,
								})}
								{' SNX'}
							</Subtext>
						</InfoCol>
						<InfoCol>
							<Subtext mr={'10px'}>{t('mintrActions.mint.action.estimateCRatio')}:</Subtext>
							<Subtext>
								{estimateCRatio({ SNXPrice, debtBalance, snxBalance, mintAmount })}%
							</Subtext>
						</InfoCol>
					</InfoRow>
				</Top>
				<Bottom>
					<TransactionPriceIndicator
						isFetchingGasLimit={isFetchingGasLimit}
						gasLimit={gasLimit}
						style={{ margin: '0' }}
					/>
					<ButtonPrimary
						disabled={isFetchingGasLimit || gasEstimateError}
						onClick={onMint}
						margin="auto"
					>
						{t('mintrActions.mint.action.buttons.mint')}
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
`;

const Bottom = styled.div`
	height: auto;
	margin-bottom: 64px;
`;

const InfoRow = styled.div`
	display: flex;
	justify-content: space-between;
`;
const InfoCol = styled.div`
	display: flex;
	justify-content: center;
`;

const Navigation = styled.div`
	width: 100%;
	display: flex;
	text-align: left;
	padding: 20px 0;
`;

const Intro = styled.div`
	max-width: 380px;
	margin-bottom: 64px;
`;

const ActionImage = styled.img`
	height: ${props => (props.big ? '64px' : '48px')};
	width: ${props => (props.big ? '64px' : '48px')};
	margin-bottom: 8px;
`;

const Form = styled.div`
	width: 400px;
	margin: 0px 0px 10px 0px;
`;

export default withTranslation()(Action);
