import React, { useContext, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { withTranslation, useTranslation } from 'react-i18next';

import { Store } from '../../store';

import { formatCurrency } from '../../helpers/formatters';
import { useFetchData } from './fetchData';

import Header from '../../components/Header';
import BarChart from '../../components/BarChart';
import Table from '../../components/Table';
import { ButtonTertiary } from '../../components/Button';
import { DataLarge, H5, H6, Figure, ButtonTertiaryLabel } from '../../components/Typography';
import Tooltip from '../../components/Tooltip';
import Skeleton from '../../components/Skeleton';

const CollRatios = ({ state }) => {
	const { t } = useTranslation();
	const { debtData, dashboardIsLoading } = state;
	return (
		<Row margin="0 0 22px 0">
			<Box>
				{dashboardIsLoading ? (
					<Skeleton style={{ marginBottom: '8px' }} height="25px" />
				) : (
					<Figure>{debtData.currentCRatio ? Math.round(100 / debtData.currentCRatio) : 0}%</Figure>
				)}
				<DataLarge>{t('dashboard.ratio.current')}</DataLarge>
			</Box>
			<Box>
				{dashboardIsLoading ? (
					<Skeleton style={{ marginBottom: '8px' }} height="25px" />
				) : (
					<Figure>{debtData.targetCRatio ? Math.round(100 / debtData.targetCRatio) : 0}%</Figure>
				)}
				<DataLarge>{t('dashboard.ratio.target')}</DataLarge>
			</Box>
		</Row>
	);
};

const Charts = ({ state }) => {
	const { t } = useTranslation();
	const { balances, debtData, escrowData } = state;
	const snxLocked =
		balances.snx &&
		debtData.currentCRatio &&
		debtData.targetCRatio &&
		balances.snx * Math.min(1, debtData.currentCRatio / debtData.targetCRatio);

	const totalEscrow = escrowData.reward + escrowData.tokenSale;

	const chartData = [
		[
			{
				label: t('dashboard.holdings.locked'),
				value: balances.snx - debtData.transferable,
			},
			{
				label: t('dashboard.holdings.transferable'),
				value: debtData.transferable,
			},
		],
		[
			{
				label: t('dashboard.holdings.staking'),
				value: snxLocked,
			},
			{
				label: t('dashboard.holdings.nonStaking'),
				value: balances.snx - snxLocked,
			},
		],
		[
			{
				label: t('dashboard.holdings.escrowed'),
				value: totalEscrow,
			},
			{
				label: t('dashboard.holdings.nonEscrowed'),
				value: balances.snx - totalEscrow,
			},
		],
	];

	return (
		<Box full={true}>
			<BoxInner>
				<BoxHeading>
					<H6 style={{ textTransform: 'uppercase' }}>{t('dashboard.holdings.title')}</H6>
					<H6>{formatCurrency(balances.snx) || 0} SNX</H6>
				</BoxHeading>
				{chartData.map((data, i) => {
					return <BarChart key={i} data={data} />;
				})}
			</BoxInner>
		</Box>
	);
};

const getBalancePerAsset = (asset, { balances, prices, debtData, synthData }) => {
	let balance,
		usdValue = 0;
	switch (asset) {
		case 'SNX':
		case 'sUSD':
		case 'ETH':
			balance = balances[asset.toLowerCase()];
			usdValue = balances[asset.toLowerCase()] * prices[asset.toLowerCase()];
			break;
		case 'Synths':
			balance = synthData.total;
			usdValue = synthData.total * prices.susd;
			break;
		case 'Debt':
			balance = debtData.debtBalance;
			usdValue = debtData.debtBalance * prices.susd;
			break;
		default:
			break;
	}
	return { balance, usdValue };
};

const renderTooltip = (dataType, t) => {
	if (!['Synths', 'Debt'].includes(dataType)) return;
	return (
		<TooltipWrapper>
			<Tooltip content={t(`tooltip.${dataType.toLowerCase()}Balance`)} />
		</TooltipWrapper>
	);
};

const processTableData = (state, t) => {
	return ['SNX', 'sUSD', 'ETH', 'Synths', 'Debt'].map(dataType => {
		const iconName = ['Synths', 'Debt'].includes(dataType) ? 'snx' : dataType.toLowerCase();
		const assetName = ['Synths', 'Debt'].includes(dataType)
			? t(`dashboard.table.${dataType.toLowerCase()}`)
			: dataType;
		const { balance, usdValue } = getBalancePerAsset(dataType, state);
		return {
			rowLegend: (
				<TableIconCell>
					<CurrencyIcon src={`/images/currencies/${iconName}.svg`} />
					{assetName}
					{renderTooltip(dataType, t)}
				</TableIconCell>
			),
			balance: balance ? formatCurrency(balance) : 0,
			usdValue: `$${usdValue ? formatCurrency(usdValue) : 0}`,
		};
	});
};

const BalanceTable = ({ state }) => {
	const { t } = useTranslation();
	const { dashboardIsLoading } = state;
	const data = processTableData(state, t);
	return (
		<Box style={{ marginTop: '16px' }} full={true}>
			<BoxInner>
				{dashboardIsLoading ? (
					<Skeleton width={'100%'} height={'242px'} />
				) : (
					<Table
						header={[
							{ key: 'rowLegend', value: '' },
							{ key: 'balance', value: t('dashboard.table.balance') },
							{ key: 'usdValue', value: '$ usd' },
						]}
						data={data}
					/>
				)}
			</BoxInner>
		</Box>
	);
};

const Dashboard = ({ t }) => {
	const theme = useContext(ThemeContext);
	const [forceRefresh, triggerRefresh] = useState(0);
	const {
		state: {
			wallet: { currentWallet },
			ui: { dashboardIsLoading },
			transactions: { successQueue },
		},
	} = useContext(Store);

	const {
		balances = {},
		prices = {},
		debtData = {},
		synthData = {},
		escrowData = {},
	} = useFetchData(currentWallet, successQueue, forceRefresh);

	return (
		<DashboardWrapper>
			<Header currentWallet={currentWallet} />
			<Content>
				<Container>
					<ContainerHeader>
						<H5 mb={0}>{t('dashboard.sections.wallet')}</H5>
						{/* //Big hack, won't stay here for long... */}
						<ButtonTertiary onClick={() => triggerRefresh(forceRefresh + 1)}>
							{t('dashboard.buttons.refresh')}
						</ButtonTertiary>
					</ContainerHeader>
					<CollRatios state={{ debtData, dashboardIsLoading }} />
					<PricesContainer>
						{['SNX', 'ETH'].map(asset => {
							return (
								<Asset key={asset}>
									<CurrencyIcon src={`/images/currencies/${asset}.svg`} />
									{dashboardIsLoading ? (
										<Skeleton height="22px" />
									) : (
										<CurrencyPrice>
											1 {asset} = ${formatCurrency(prices[asset.toLowerCase()])} USD
										</CurrencyPrice>
									)}
								</Asset>
							);
						})}
					</PricesContainer>
					<Charts
						state={{
							balances,
							debtData,
							theme,
							dashboardIsLoading,
							escrowData,
						}}
					/>
					<BalanceTable
						state={{
							balances,
							synthData,
							debtData,
							prices,
							dashboardIsLoading,
						}}
					/>
					<Row margin="18px 0 0 0 ">
						<Link href="https://synthetix.exchange" target="_blank">
							<ButtonTertiaryLabel>{t('dashboard.buttons.exchange')}</ButtonTertiaryLabel>
						</Link>
						<Link
							href="https://dashboard.synthetix.io"
							target="_blank"
							style={{ marginLeft: '5px' }}
						>
							<ButtonTertiaryLabel>{t('dashboard.buttons.synthetixDashboard')}</ButtonTertiaryLabel>
						</Link>
					</Row>
				</Container>
			</Content>
		</DashboardWrapper>
	);
};

const DashboardWrapper = styled('div')`
	background: ${props => props.theme.colorStyles.panels};
	width: 623px;
	h1 {
		color: ${props => props.theme.colorStyles.heading};
		margin: 0;
	}
	p {
		color: ${props => props.theme.colorStyles.body};
		margin: 0;
	}
	// transition: all ease-out 0.5s;
	flex-shrink: 0;
	border-right: 1px solid ${props => props.theme.colorStyles.borders};
	padding-bottom: 40px;
	min-height: 100vh;
`;

const Content = styled('div')`
	padding: 0 32px;
`;

const Container = styled.div`
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: ${props => (props.curved ? '40px' : '5px')};
	padding: ${props => (props.curved ? '15px' : '32px 24px')};
	margin: ${props => (props.curved ? '16px 0' : '0')};
`;

const ContainerHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
`;

const Row = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: ${props => (props.margin ? props.margin : 0)};
	padding: ${props => (props.padding ? props.padding : 0)};
`;

const Box = styled.div`
	border-radius: 2px;
	border: 1px solid ${props => props.theme.colorStyles.borders};
	width: ${props => (props.full ? '100%' : '240px')};
	height: ${props => (props.full ? '100%' : '96px')};
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const BoxInner = styled.div`
	padding: 24px;
	width: 100%;
`;

const BoxHeading = styled.div`
	witdh: 100%;
	display: flex;
	justify-content: space-between;
	border-bottom: 1px solid ${props => props.theme.colorStyles.borders};
`;

const Link = styled.a`
	background-color: ${props => props.theme.colorStyles.buttonTertiaryBgFocus};
	text-transform: uppercase;
	text-decoration: none;
	cursor: pointer;
	padding: 16px 20px;
	width: 50%;
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 2px;
	text-align: center;
`;

const CurrencyIcon = styled.img`
	width: 22px;
	height: 22px;
	margin-right: 5px;
`;

const TableIconCell = styled.div`
	display: flex;
	align-items: center;
`;

const TooltipWrapper = styled.div`
	margin-left: 10px;
`;

const PricesContainer = styled.div`
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 5px;
	padding: 16px;
	margin-bottom: 16px;
	display: flex;
	flex-direction: row;
`;

const Asset = styled.div`
	display: flex;
	flex-direction: row;
	margin: auto;
	align-items: center;
	justify-content: center;
`;

const CurrencyPrice = styled.div`
	font-size: 16px;
	font-family: 'apercu-medium';
	margin-left: 4px;
	align-items: center;
	color: ${props => props.theme.colorStyles.body};
`;

export default withTranslation()(Dashboard);
