import React from 'react';
import styled from 'styled-components';
import { withTranslation, useTranslation } from 'react-i18next';

import { formatCurrency } from '../../../helpers/formatters';

import { SlidePage } from '../../../components/ScreenSlider';
import TransactionPriceIndicator from '../../../components/TransactionPriceIndicator';
import { ButtonPrimary, ButtonTertiary } from '../../../components/Button';
import {
	PLarge,
	PMedium,
	H1,
	H5,
	Subtext,
	DataHeaderLarge,
	DataLarge,
	TableHeaderMedium,
} from '../../../components/Typography';
import { TableWrapper, Table, THead, TBody, TH, TR, TD } from '../../../components/ScheduleTable';
import Skeleton from '../../../components/Skeleton';
import Tooltip from '../../../components/Tooltip';

const Periods = ({ state = {} }) => {
	const { t } = useTranslation();
	const { feesByPeriod = [], dataIsLoading } = state;
	return (
		<div>
			<TableWrapper height="auto">
				{dataIsLoading ? (
					<Skeleton width={'100%'} height={'110px'} />
				) : (
					<Table cellSpacing="0">
						<THead>
							<TR>
								<TH padding={'10px'}>
									<TableHeaderMedium>sUSD</TableHeaderMedium>
								</TH>
								<TH padding={'10px'}>
									<TableHeaderMedium>SNX</TableHeaderMedium>
								</TH>
								<TH padding={'10px'}>
									<TableHeaderMedium>
										{t('mintrActions.claim.action.table.period')}
									</TableHeaderMedium>
								</TH>
							</TR>
						</THead>
						<TBody>
							{feesByPeriod.map(({ fee, reward, closeIn }, i) => {
								return (
									<TR key={i}>
										<TD padding={'0 10px'}>
											<DataLarge>{formatCurrency(fee, 3)}</DataLarge>
										</TD>
										<TD padding={'0 10px'}>
											<DataLarge>{formatCurrency(reward, 3)}</DataLarge>
										</TD>
										<TD style={{ whiteSpace: 'nowrap' }} padding={'0 20px'}>
											<DataLarge>{closeIn}</DataLarge>
										</TD>
									</TR>
								);
							})}
						</TBody>
					</Table>
				)}
			</TableWrapper>
		</div>
	);
};

const Action = ({
	t,
	onDestroy,
	onClaim,
	onClaimHistory,
	feesByPeriod,
	feesAreClaimable,
	feesAvailable,
	dataIsLoading,
	isFetchingGasLimit,
	gasEstimateError,
}) => {
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
				<Middle>
					<Schedule>
						<Periods state={{ feesByPeriod, dataIsLoading }} />
						<Status>
							<PMedium width="100%">{t('mintrActions.claim.action.table.status')}</PMedium>
							<State>
								<Highlighted red={!feesAreClaimable} marginRight="8px">
									{feesAreClaimable
										? t('mintrActions.claim.action.table.open')
										: t('mintrActions.claim.action.table.blocked')}
								</Highlighted>
								<Tooltip width={'250px'} content={t('tooltip.claim')} />
							</State>
						</Status>
					</Schedule>
					<Details>
						<Box>
							<DataHeaderLarge>{t('mintrActions.claim.action.tradingRewards')}</DataHeaderLarge>
							<Amount>
								{feesAvailable && feesAvailable[0] ? formatCurrency(feesAvailable[0]) : 0}
							</Amount>
						</Box>
						<Box>
							<DataHeaderLarge>{t('mintrActions.claim.action.stakingRewards')}</DataHeaderLarge>
							<Amount>
								{feesAvailable && feesAvailable[1] ? formatCurrency(feesAvailable[1]) : 0}
							</Amount>
						</Box>
					</Details>
				</Middle>
				<Bottom>
					<TransactionPriceIndicator style={{ margin: '0' }} />
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

const Middle = styled.div`
	height: auto;
	margin: 0 auto;
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	@media (max-width: ${WrapTableBreakpoint}px) {
		flex-direction: column;
	}
`;

const Bottom = styled.div`
	height: auto;
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

const Schedule = styled.div`
	border: 1px solid ${props => props.theme.colorStyles.borders};
	height: auto;
	width: 60%;
	margin: 8px 16px 8px 0px;
	padding: 24px 16px 0 16px;
	text-align: left;
	@media (max-width: ${WrapTableBreakpoint}px) {
		width: 100%;
	}
`;

const Status = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const State = styled.div`
	display: flex;
	text-align: right;
	align-items: center;
`;

const Details = styled.div`
	display: flex;
	flex-direction: column;
	width: 40%;
	@media (max-width: ${WrapTableBreakpoint}px) {
		flex-direction: row;
		width: 100%;
		justify-content: space-between;
		> div {
			width: calc(50% - 8px);
			padding-top: 16px;
			padding-bottom: 16px;
		}
	}
`;

const Box = styled.div`
	height: auto;
	width: auto;
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

const Highlighted = styled.span`
	font-family: 'apercu-bold';
	margin: 0px 8px;
	color: ${props =>
		props.red ? props.theme.colorStyles.brandRed : props.theme.colorStyles.hyperlink};
`;

const Note = styled.div`
	margin-top: 16px;
	max-width: 420px;
`;

const Subtitle = styled(PLarge)`
	@media (max-width: ${WrapTableBreakpoint}px) {
		font-size: 14px;
		line-height: 18px;
	}
`;

export default withTranslation()(Action);
