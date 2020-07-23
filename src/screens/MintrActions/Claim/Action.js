import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { formatCurrency } from '../../../helpers/formatters';

import { SlidePage } from '../../../components/ScreenSlider';
import TransactionPriceIndicator from '../../../components/TransactionPriceIndicator';
import { ButtonPrimary, ButtonTertiary } from '../../../components/Button';
import {
	PLarge,
	H1,
	Subtext,
	DataHeaderLarge,
	TableHeaderMedium,
	H2,
} from '../../../components/Typography';

import Tooltip from '../../../components/Tooltip';
import { Info } from '../../../components/Icons';

const Action = ({
	onDestroy,
	onClaim,
	onClaimHistory,
	closeIn,
	feesAreClaimable,
	feesAvailable,
	isFetchingGasLimit,
	gasEstimateError,
	gasLimit,
	theme,
}) => {
	const { t } = useTranslation();
	return (
		<SlidePage>
			<Container>
				<Navigation>
					<ButtonTertiary onClick={onDestroy}>{t('button.navigation.cancel')}</ButtonTertiary>
					<ButtonTertiary onClick={onClaimHistory}>
						{t('mintrActions.claim.action.buttons.history')} ↗
					</ButtonTertiary>
				</Navigation>
				<Intro>
					<ActionImage src="/images/actions/claim.svg" big />
					<H1 m={'10px 0'}>{t('mintrActions.claim.action.title')}</H1>
					<Subtitle>{t('mintrActions.claim.action.subtitle')}</Subtitle>
				</Intro>
				<BoxRow>
					<Box>
						<DataHeaderLarge>{t('mintrActions.claim.action.tradingRewards')}</DataHeaderLarge>
						<Amount>
							{feesAvailable && feesAvailable[0] ? formatCurrency(feesAvailable[0]) : 0} sUSD
						</Amount>
					</Box>
					<Box>
						<DataHeaderLarge>{t('mintrActions.claim.action.stakingRewards')}</DataHeaderLarge>
						<Amount>
							{feesAvailable && feesAvailable[1] ? formatCurrency(feesAvailable[1]) : 0} SNX
						</Amount>
					</Box>
				</BoxRow>
				<TimeLeftRow>
					<TimeLeftHeading>{t('mintrActions.claim.action.timeLeft')}</TimeLeftHeading>
					<StyledH2>{closeIn}</StyledH2>
				</TimeLeftRow>
				<Bottom>
					<Status>
						<Subtext>{t('mintrActions.claim.action.table.status')}:</Subtext>
						<Highlighted red={!feesAreClaimable} marginRight="8px">
							{feesAreClaimable
								? t('mintrActions.claim.action.table.open')
								: t('mintrActions.claim.action.table.blocked')}
						</Highlighted>
						<Tooltip mode={theme} title={t(`tooltip.claim`)} placement="top">
							<IconContainer>
								<Info />
							</IconContainer>
						</Tooltip>
					</Status>
					<TransactionPriceIndicator
						isFetchingGasLimit={isFetchingGasLimit}
						gasLimit={gasLimit}
						style={{ margin: '0' }}
					/>
					<ButtonPrimary
						disabled={!feesAreClaimable || isFetchingGasLimit || gasEstimateError}
						onClick={onClaim}
						margin="auto"
					>
						{t('mintrActions.claim.action.buttons.claim')}
					</ButtonPrimary>
					<Note>
						<Subtext>{t('mintrActions.claim.action.note')}</Subtext>
					</Note>
				</Bottom>
			</Container>
		</SlidePage>
	);
};
const WrapTableBreakpoint = 1340;
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

const Bottom = styled.div``;

const StyledH2 = styled(H2)`
	margin-top: 14px;
`;

const Navigation = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	padding: 20px 0;
`;

const Intro = styled.div`
	width: 100%;
	margin: 0px auto;
`;

const ActionImage = styled.img`
	height: ${props => (props.big ? '64px' : '48px')};
	width: ${props => (props.big ? '64px' : '48px')};
	@media (max-width: ${WrapTableBreakpoint}px) {
		width: 48px;
		height: 48px;
	}
`;

const Status = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	& > p {
		margin: 0;
	}
`;

const BoxRow = styled.div`
	display: flex;
`;

const TimeLeftRow = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: column;
`;

const TimeLeftHeading = styled(TableHeaderMedium)`
	text-transform: uppercase;
`;

const Box = styled.div`
	flex: 1;
	padding: 24px;
	margin: 8px 0px;
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 2px;
	display: flex;
	flex-direction: column;
	&:last-child {
		margin-left: 32px;
	}
`;

const Amount = styled.span`
	color: ${props => props.theme.colorStyles.hyperlink};
	font-family: 'apercu-medium';
	font-size: 24px;
	margin: 12px 0px 0px 0px;
`;

const Highlighted = styled.span`
	text-transform: uppercase;
	font-family: 'apercu-bold';
	margin: 0px 8px;
	color: ${props =>
		props.red ? props.theme.colorStyles.brandRed : props.theme.colorStyles.hyperlink};
`;

const Note = styled.div`
	margin-top: 16px;
	max-width: 420px;
`;

const IconContainer = styled.div`
	margin-left: 10px;
	width: 23px;
	height: 23px;
`;

const Subtitle = styled(PLarge)`
	@media (max-width: ${WrapTableBreakpoint}px) {
		font-size: 14px;
		line-height: 18px;
	}
`;

export default Action;
