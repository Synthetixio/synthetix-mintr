import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { SynthetixJs } from 'synthetix-js';
import { providers } from 'ethers';
import orderBy from 'lodash/orderBy';
import last from 'lodash/last';
import Bottleneck from 'bottleneck';
import snxData from 'synthetix-data';
import snxJSConnector from 'helpers/snxJSConnector';

import { SlidePage, SliderContent } from 'components/ScreenSlider';
import { ButtonTertiary } from 'components/Button';
import { PLarge, H1, Subtext } from 'components/Typography';
import { ExternalLink, BorderedContainer } from 'styles/common';

import { getCurrentWallet } from 'ducks/wallet';
import { INFURA_JSON_RPC_URLS } from 'helpers/networkHelper';
import { formatCurrencyWithSign, bytesFormatter } from 'helpers/formatters';

import DebtChart from './DebtChart';
import BalanceTable from './BalanceTable';

const MIN_BLOCK = 8314597;

const Track = ({ onDestroy, currentWallet }) => {
	const { t } = useTranslation();
	const [historicalDebt, setHistoricalDebt] = useState([]);

	useEffect(() => {
		if (!currentWallet) return;
		const { snxJS } = snxJSConnector;
		const fetchEvents = async () => {
			try {
				const [burnEvents, mintEvents, currentDebt] = await Promise.all([
					snxData.snx.burned({ account: currentWallet, max: 1000, minBlock: MIN_BLOCK }),
					snxData.snx.issued({ account: currentWallet, max: 1000, minBlock: MIN_BLOCK }),
					snxJS.Synthetix.debtBalanceOf(currentWallet, bytesFormatter('sUSD')),
				]);

				const burnEventsMap = burnEvents.map(event => {
					return { ...event, type: 'burn' };
				});

				const mintEventsMap = mintEvents.map(event => {
					return { ...event, type: 'mint' };
				});

				const eventBlocks = orderBy(burnEventsMap.concat(mintEventsMap), 'block', 'asc');

				const mintAndBurnAggregation = [];
				eventBlocks.forEach(event => {
					const multiplier = event.type === 'burn' ? -1 : 1;
					const sum =
						mintAndBurnAggregation.length === 0
							? event.value
							: mintAndBurnAggregation.reduce((a, b) => a + b.debt + multiplier * event.value, 0);
					mintAndBurnAggregation.push({
						block: event.block,
						timestamp: event.timestamp,
						debt: sum,
					});
				});

				const limiter = new Bottleneck({
					maxConcurrent: 30,
					minTime: 7,
				});
				const provider = new providers.JsonRpcProvider(INFURA_JSON_RPC_URLS[1]);
				const test = new SynthetixJs({ provider });

				const getBalance = async transaction => {
					const debt = await test.Synthetix.contract.debtBalanceOf(
						currentWallet,
						bytesFormatter('sUSD'),
						{
							blockTag: transaction.block,
						}
					);
					return {
						timestamp: transaction.timestamp,
						block: transaction.block,
						debt: debt / 1e18,
					};
				};

				const historicalDebt = await Promise.all(eventBlocks.map(limiter.wrap(getBalance)));

				let historicalDebtAndIssuance = [];
				historicalDebt.forEach((debt, i) => {
					historicalDebtAndIssuance.push({
						timestamp: debt.timestamp,
						issuanceDebt: mintAndBurnAggregation[i].debt,
						activeDebt: debt.debt,
						netDebt: mintAndBurnAggregation[i].debt - debt.debt,
					});
				});
				historicalDebtAndIssuance.push({
					timestamp: new Date().getTime(),
					activeDebt: currentDebt / 1e18,
					issuanceDebt: last(mintAndBurnAggregation).debt,
					netDebt: last(mintAndBurnAggregation).debt - currentDebt / 1e18,
				});
				setHistoricalDebt(historicalDebtAndIssuance);
			} catch (e) {
				console.log(e);
				setHistoricalDebt([]);
			}
		};
		fetchEvents();
	}, [currentWallet]);
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
						{t('mintrActions.track.action.subtitle')}{' '}
						<StyledExternalLink href="https://www.zapper.fi/">
							Zapper.fi <LinkArrow>↗</LinkArrow>
						</StyledExternalLink>
					</PLarge>
				</Header>
				<Body>
					<Grid>
						<GridColumn>
							<BorderedContainer>
								<StyledSubtext>{t('mintrActions.track.action.data.totalSynths')}</StyledSubtext>
								<Amount>{formatCurrencyWithSign('$', 1000000)}</Amount>
							</BorderedContainer>

							<BorderedContainer>
								<StyledSubtext>{t('mintrActions.track.action.data.synthDebt')}</StyledSubtext>
								<Amount>{formatCurrencyWithSign('$', 1000000)}</Amount>
							</BorderedContainer>

							<BorderedContainer>
								<StyledSubtext>{t('mintrActions.track.action.data.netDebt')}</StyledSubtext>
								<Amount>{formatCurrencyWithSign('$', 1000000)}</Amount>
							</BorderedContainer>
						</GridColumn>
						<GridColumn>
							<ChartBorderedContainer>
								<StyledSubtext>{t('mintrActions.track.action.chart.title')}</StyledSubtext>
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
	height: 268px;
`;

const mapStateToProps = state => ({
	currentWallet: getCurrentWallet(state),
});

export default connect(mapStateToProps, null)(Track);
