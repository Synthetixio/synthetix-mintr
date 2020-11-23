import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { SlidePage } from 'components/ScreenSlider';
import TransactionPriceIndicator from 'components/TransactionPriceIndicator';
import { ButtonPrimary, ButtonTertiary } from 'components/Button';
import { PLarge, H1, DataHeaderLarge } from 'components/Typography';
import { MicroSpinner } from 'components/Spinner';

import { FlexDiv } from 'styles/common';
import { formatCurrency } from 'helpers/formatters';

const Action = ({
	onDestroy,
	onWithdraw,
	onApprove,
	isFetchingGasLimit,
	gasEstimateError,
	isWaitingForAllowance,
	hasAllowance,
	snxBalance,
	gasLimit,
}) => {
	const { t } = useTranslation();
	return (
		<SlidePage>
			<Container>
				<Navigation>
					<ButtonTertiary onClick={onDestroy}>{t('button.navigation.cancel')}</ButtonTertiary>
				</Navigation>

				<Top>
					<Intro>
						<ActionImage src="/images/actions/withdrawL2.svg" big />
						<StyledH1>{t('mintrActions.withdraw.action.title')}</StyledH1>
						<PLarge>{t('mintrActions.withdraw.action.subtitle')}</PLarge>
					</Intro>
					<FlexDiv>
						<Box>
							<DataHeaderLarge>{t('mintrActions.withdraw.action.amount')}</DataHeaderLarge>
							<Amount>{`${formatCurrency(snxBalance)} SNX`}</Amount>
						</Box>
					</FlexDiv>
				</Top>
				<Bottom>
					<TransactionPriceIndicator
						isFetchingGasLimit={isFetchingGasLimit}
						gasLimit={gasLimit}
						style={{ margin: '0' }}
					/>
					{hasAllowance ? (
						<ButtonPrimary
							disabled={isFetchingGasLimit || gasEstimateError || !snxBalance}
							onClick={onWithdraw}
							margin="auto"
						>
							{t('mintrActions.withdraw.action.buttons.withdraw')}
						</ButtonPrimary>
					) : (
						<ButtonPrimary onClick={onApprove} margin="auto">
							{isWaitingForAllowance ? (
								<StyledMicroSpinner color="#ffffff" />
							) : (
								t('mintrActions.withdraw.action.buttons.approve')
							)}
						</ButtonPrimary>
					)}
				</Bottom>
			</Container>
		</SlidePage>
	);
};

const StyledMicroSpinner = styled(MicroSpinner)`
	margin: 0 auto;
`;

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
	padding: 0 64px;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	justify-content: space-around;
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
	text-align: left;
	padding: 20px 0 0 0;
`;

const Intro = styled.div`
	max-width: 380px;
	margin-bottom: 64px;
`;

const ActionImage = styled.img`
	height: 164px;
	width: 164px;
`;

const Box = styled.div`
	flex: 1;
	padding: 24px;
	margin: 8px 0px;
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 2px;
	display: flex;
	flex-direction: column;
`;

const Amount = styled.span`
	color: ${props => props.theme.colorStyles.hyperlink};
	font-family: 'apercu-medium';
	font-size: 24px;
	margin: 12px 0px 0px 0px;
`;

export default Action;
