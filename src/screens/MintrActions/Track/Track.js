import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';
import orderBy from 'lodash/orderBy';
import last from 'lodash/last';
import snxData from 'synthetix-data';
import snxJSConnector from 'helpers/snxJSConnector';

import Tooltip from 'components/Tooltip';
import { SlidePage, SliderContent } from 'components/ScreenSlider';
import { ButtonTertiary } from 'components/Button';
import { PLarge, H1, Subtext } from 'components/Typography';
import { ExternalLink, BorderedContainer, FlexDivCentered, Strong } from 'styles/common';

import { getCurrentWallet } from 'ducks/wallet';
import { getWalletBalances } from 'ducks/balances';
import { getSUSDRate } from 'ducks/rates';
import { getCurrentTheme } from 'ducks/ui';
import { formatCurrencyWithSign, bytesFormatter } from 'helpers/formatters';

import DebtChart from './DebtChart';
import BalanceTable from './BalanceTable';

import { Info } from 'components/Icons';

const Track = ({ onDestroy, currentWallet, balances: { totalSynths }, sUSDRate, currentTheme }) => {
	const { t } = useTranslation();
	const [debtData, setDebtData] = useState({});
	const [historicalDebt, setHistoricalDebt] = useState([]);

	useEffect(() => {
		if (!currentWallet) return;
		const { snxJS } = snxJSConnector;
		const fetchEvents = async () => {
			try {
				const [burnEvents, mintEvents, debtHistory, currentDebt] = await Promise.all([
					snxData.snx.burned({ account: currentWallet, max: 1000 }),
					snxData.snx.issued({ account: currentWallet, max: 1000 }),
					snxData.snx.debtSnapshot({ account: currentWallet, max: 1000 }),
					snxJS.Synthetix.debtBalanceOf(currentWallet, bytesFormatter('sUSD')),
				]);

				const burnEventsMap = burnEvents.map(event => {
					return { ...event, type: 'burn' };
				});

				const mintEventsMap = mintEvents.map(event => {
					return { ...event, type: 'mint' };
				});

				// We concat both the events and order them (asc)
				const eventBlocks = orderBy(burnEventsMap.concat(mintEventsMap), 'block', 'asc');

				// We set historicalIssuanceAggregation array, to store all the cumulative
				// values of every mint and burns
				const historicalIssuanceAggregation = [];
				eventBlocks.forEach((event, i) => {
					const multiplier = event.type === 'burn' ? -1 : 1;
					const aggregation =
						historicalIssuanceAggregation.length === 0
							? multiplier * event.value
							: multiplier * event.value + historicalIssuanceAggregation[i - 1];

					historicalIssuanceAggregation.push(aggregation);
				});

				// We merge both actual & issuance debt into an array
				let historicalDebtAndIssuance = [];
				debtHistory.reverse().forEach((debtSnapshot, i) => {
					historicalDebtAndIssuance.push({
						timestamp: debtSnapshot.timestamp,
						issuanceDebt: historicalIssuanceAggregation[i],
						actualDebt: debtSnapshot.debtBalanceOf,
						// netDebt: debtSnapshot.debtBalanceOf - historicalIssuanceAggregation[i],
					});
				});

				// Last occurrence is the current state of the debt
				// Issuance debt = last occurrence of the historicalDebtAndIssuance array
				historicalDebtAndIssuance.push({
					timestamp: new Date().getTime(),
					actualDebt: currentDebt / 1e18,
					issuanceDebt: last(historicalIssuanceAggregation),
					// netDebt: currentDebt / 1e18 - last(historicalIssuanceAggregation),
				});

				setHistoricalDebt(historicalDebtAndIssuance);
				setDebtData({
					mintAndBurnDebt: last(historicalIssuanceAggregation),
					actualDebt: currentDebt / 1e18,
					// netDebt: currentDebt / 1e18 - last(historicalIssuanceAggregation),
				});
			} catch (e) {
				console.log(e);
			}
		};
		fetchEvents();
	}, [currentWallet]);

	const mintAndBurnDebtValue = debtData ? debtData.mintAndBurnDebt * sUSDRate : 0;
	const actualDebtValue = debtData ? debtData.actualDebt * sUSDRate : 0;
	const totalSynthsValue = totalSynths ? totalSynths * sUSDRate : 0;
	// const netDebtValue = debtData ? debtData.netDebt * sUSDRate : 0;

	return (
		<SlidePage>
			<SliderContent>
				<Navigation>
					<ButtonTertiary onClick={onDestroy}>{t('button.navigation.cancel')}</ButtonTertiary>
				</Navigation>
				<Header>
					<ActionImage src="/images/actions/track.svg" />
					<StyledH1>{t('mintrActions.track.action.title')}</StyledH1>
					<PLarge>
						{t('mintrActions.track.action.subtitle')}
						<StyledExternalLink href="https://www.zapper.fi/">
							{' '}
							Zapper.fi <LinkArrow>↗</LinkArrow>
						</StyledExternalLink>
					</PLarge>
				</Header>
				<Body>
					<Grid>
						<GridColumn>
							<BorderedContainer>
								<StyledSubtext>{t('mintrActions.track.action.data.issuedDebt')}</StyledSubtext>
								<Amount>{formatCurrencyWithSign('$', mintAndBurnDebtValue)}</Amount>
							</BorderedContainer>

							<BorderedContainer>
								<StyledSubtext>{t('mintrActions.track.action.data.actualDebt')}</StyledSubtext>
								<Amount>{formatCurrencyWithSign('$', actualDebtValue)}</Amount>
							</BorderedContainer>

							<BorderedContainer>
								<StyledSubtext>{t('mintrActions.track.action.data.totalSynths')}</StyledSubtext>
								<Amount>{formatCurrencyWithSign('$', totalSynthsValue)}</Amount>
							</BorderedContainer>

							{/* <BorderedContainer>
								<StyledSubtext>{t('mintrActions.track.action.data.netDebt')}</StyledSubtext>
								<Amount>{formatCurrencyWithSign('$', netDebtValue)}</Amount>
							</BorderedContainer> */}
						</GridColumn>
						<GridColumn>
							<ChartBorderedContainer>
								<FlexDivCentered>
									<StyledSubtext>{t('mintrActions.track.action.chart.title')}</StyledSubtext>
									<Tooltip
										mode={currentTheme}
										title={
											<Trans
												i18nKey="tooltip.track"
												components={[<Strong />, <br />, <Strong />]}
											></Trans>
										}
										placement="top"
									>
										<TooltipIconContainer>
											<Info />
										</TooltipIconContainer>
									</Tooltip>
								</FlexDivCentered>
								<DebtChart data={historicalDebt} />
							</ChartBorderedContainer>
						</GridColumn>
					</Grid>
					<TableBorderedContainer>
						<BalanceTable />
					</TableBorderedContainer>
				</Body>
			</SliderContent>
		</SlidePage>
	);
};

const Navigation = styled.div`
	width: 100%;
	display: flex;
	text-align: left;
`;

const StyledH1 = styled(H1)`
	margin: 18px 0 8px 0;
`;
const Header = styled.div``;
const Body = styled.div`
	width: 100%;
`;

const ActionImage = styled.img`
	height: 48px;
	width: 48px;
`;

const StyledSubtext = styled(Subtext)`
	text-transform: uppercase;
	color: ${props => props.theme.colorStyles.body};
	font-family: 'apercu-medium';
	margin: 0;
`;

const Amount = styled.span`
	color: ${props => props.theme.colorStyles.hyperlink};
	font-family: 'apercu-medium';
	font-size: 18px;
	margin-top: 4px;
`;

const Grid = styled.div`
	display: grid;
	width: 100%;
	grid-template-columns: 170px 1fr;
	grid-column-gap: 18px;
`;

const GridColumn = styled.div`
	display: grid;
	grid-row-gap: 18px;
`;

const StyledExternalLink = styled(ExternalLink)`
	color: ${props => props.theme.colorStyles.hyperlink};
`;

const LinkArrow = styled.span`
	font-size: 10px;
`;

const ChartBorderedContainer = styled(BorderedContainer)`
	justify-content: flex-start;
	align-items: flex-start;
`;

const TableBorderedContainer = styled(BorderedContainer)`
	margin-top: 18px;
	height: 248px;
`;

const TooltipIconContainer = styled.div`
	margin-left: 10px;
	width: 23px;
	height: 23px;
`;

const mapStateToProps = state => ({
	currentWallet: getCurrentWallet(state),
	balances: getWalletBalances(state),
	sUSDRate: getSUSDRate(state),
	currentTheme: getCurrentTheme(state),
});

export default connect(mapStateToProps, null)(Track);
