import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';

import { formatCurrency } from 'helpers/formatters';
import { getWalletDetails } from 'ducks/wallet';
import { showModal } from 'ducks/modal';
import { getCurrentTheme } from 'ducks/ui';
import { getWalletBalances, fetchBalancesRequest, getIsFetchingBalances } from 'ducks/balances';
import {
	getDebtStatusData,
	fetchDebtStatusRequest,
	getIsFetchingBDebtData,
} from 'ducks/debtStatus';
import { getRates } from 'ducks/rates';
import { getTotalEscrowedBalance, fetchEscrowRequest, getIsFetchingEscrowData } from 'ducks/escrow';

import { MODAL_TYPES_TO_KEY } from 'constants/modal';

import Header from 'components/Header';
import { MicroSpinner } from 'components/Spinner';

import { ButtonTertiary } from 'components/Button';
import { H5, ButtonTertiaryLabel, DataLarge, Figure } from 'components/Typography';
import Skeleton from 'components/Skeleton';
import Tooltip from 'components/Tooltip';
import { Info } from 'components/Icons';
import BalanceTable from './BalanceTable';
import BarCharts from './BarCharts';
import CollRatios from './CollRatios';
import { FlexDivCentered } from 'styles/common';

const Dashboard = ({
	walletDetails,
	showModal,
	rates,
	debtStatusData,
	totalEscrowedBalances,
	fetchEscrowRequest,
	fetchDebtStatusRequest,
	fetchBalancesRequest,
	isFetchingBalances,
	isFetchingDebtData,
	isFetchingEscrowData,
	currentTheme,
}) => {
	const { t } = useTranslation();
	const { currentWallet } = walletDetails;
	const isDashboardRefreshing = isFetchingBalances || isFetchingDebtData || isFetchingEscrowData;
	return (
		<DashboardWrapper>
			<Header currentWallet={currentWallet} />
			<Content>
				<Container>
					<ContainerHeader>
						<H5 mb={0}>{t('dashboard.sections.wallet')}</H5>
						<ButtonContainer>
							<ButtonTertiary onClick={() => showModal({ modalType: MODAL_TYPES_TO_KEY.DELEGATE })}>
								{t('dashboard.buttons.delegate')}
							</ButtonTertiary>
							<ButtonTertiary
								disabled={isDashboardRefreshing}
								style={{ minWidth: '102px' }}
								onClick={() => {
									fetchDebtStatusRequest();
									fetchBalancesRequest();
									fetchEscrowRequest();
								}}
							>
								{isDashboardRefreshing ? <MicroSpinner /> : t('dashboard.buttons.refresh')}
							</ButtonTertiary>
						</ButtonContainer>
					</ContainerHeader>
					<CollRatios debtStatusData={debtStatusData} />
					<PricesContainer>
						<LiquidationContainer>
							<DataLarge>{t('dashboard.liquidation.title')}</DataLarge>
							<FigureContainer>
								<StyledFigure>{debtStatusData ? debtStatusData.liquidationRatio : 0}%</StyledFigure>
								<Tooltip
									mode={currentTheme}
									title={t('tooltip.liquidation', {
										liquidationDelay: debtStatusData ? debtStatusData.liquidationDelay / 3600 : 0,
									})}
									placement="top"
								>
									<IconContainer>
										<Info />
									</IconContainer>
								</Tooltip>
							</FigureContainer>
						</LiquidationContainer>
					</PricesContainer>
					<PricesContainer>
						{['SNX', 'ETH'].map(asset => {
							return (
								<Asset key={asset}>
									<CurrencyIcon src={`/images/currencies/${asset}.svg`} />
									{isEmpty(rates) ? (
										<Skeleton height="22px" />
									) : (
										<CurrencyPrice>
											1 {asset} = ${formatCurrency(rates[asset])} USD
										</CurrencyPrice>
									)}
								</Asset>
							);
						})}
					</PricesContainer>
					<BarCharts debtData={debtStatusData} totalEscrow={totalEscrowedBalances} />
					<BalanceTable debtData={debtStatusData} />
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

const ButtonContainer = styled.div`
	display: flex;
	align-items: center;
	& > button + button {
		margin-left: 10px;
	}
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
	font-family: 'apercu-medium', sans-serif;
	margin-left: 4px;
	align-items: center;
	color: ${props => props.theme.colorStyles.body};
`;

const LiquidationContainer = styled(FlexDivCentered)`
	justify-content: space-between;
	width: 100%;
`;

const StyledFigure = styled(Figure)`
	margin: 6px 0 0 0;
	font-size: 22px;
`;

const FigureContainer = styled(FlexDivCentered)``;

const IconContainer = styled.div`
	margin-left: 10px;
	width: 23px;
	height: 23px;
`;

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
	walletBalances: getWalletBalances(state),
	rates: getRates(state),
	debtStatusData: getDebtStatusData(state),
	totalEscrowedBalances: getTotalEscrowedBalance(state),
	isFetchingBalances: getIsFetchingBalances(state),
	isFetchingDebtData: getIsFetchingBDebtData(state),
	isFetchingEscrowData: getIsFetchingEscrowData(state),
	currentTheme: getCurrentTheme(state),
});

const mapDispatchToProps = {
	showModal,
	fetchBalancesRequest,
	fetchDebtStatusRequest,
	fetchEscrowRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
