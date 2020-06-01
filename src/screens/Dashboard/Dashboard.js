import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';

import { formatCurrency } from '../../helpers/formatters';
import { fetchData } from './fetchData';
import { getWalletDetails } from '../../ducks/wallet';
import { getSuccessQueue } from '../../ducks/transactions';
import { showModal } from '../../ducks/modal';
import { fetchBalances, getWalletBalances, getWalletBalancesWithRates } from '../../ducks/balances';
import { getRates } from '../../ducks/rates';

import { MODAL_TYPES_TO_KEY } from '../../constants/modal';

import Header from '../../components/Header';

import { ButtonTertiary } from '../../components/Button';
import { DataLarge, H5, Figure, ButtonTertiaryLabel } from '../../components/Typography';
import Skeleton from '../../components/Skeleton';
import { MicroSpinner } from '../../components/Spinner';
import BalanceTable from './BalanceTable';
import Box from './Box';
import BarCharts from './BarCharts';

const INTERVAL_TIMER = 5 * 60 * 1000;

const CollRatios = ({ state }) => {
	const { t } = useTranslation();
	const { debtData } = state;

	return (
		<Row margin="0 0 22px 0">
			<Box>
				{isEmpty(debtData) ? (
					<Skeleton style={{ marginBottom: '8px' }} height="25px" />
				) : (
					<Figure>{debtData.currentCRatio ? Math.round(100 / debtData.currentCRatio) : 0}%</Figure>
				)}
				<DataLarge>{t('dashboard.ratio.current')}</DataLarge>
			</Box>
			<Box>
				{isEmpty(debtData) ? (
					<Skeleton style={{ marginBottom: '8px' }} height="25px" />
				) : (
					<Figure>{debtData.targetCRatio ? Math.round(100 / debtData.targetCRatio) : 0}%</Figure>
				)}
				<DataLarge>{t('dashboard.ratio.target')}</DataLarge>
			</Box>
		</Row>
	);
};

const Dashboard = ({ walletDetails, successQueue, showModal, rates, fetchBalances }) => {
	const { t } = useTranslation();
	const { currentWallet } = walletDetails;
	const [dashboardIsLoading, setDashboardIsLoading] = useState(true);
	const [data, setData] = useState({});
	const loadData = useCallback(() => {
		setDashboardIsLoading(true);
		fetchBalances(currentWallet);
		fetchData(currentWallet, successQueue).then(data => {
			setData(data);
			setDashboardIsLoading(false);
		});
	}, [currentWallet, successQueue, fetchBalances]);

	useEffect(() => {
		loadData();
		const intervalId = setInterval(() => {
			loadData();
		}, INTERVAL_TIMER);
		return () => {
			clearInterval(intervalId);
		};
	}, [loadData]);

	const { debtData = {}, escrowData = {} } = data;

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
								disabled={dashboardIsLoading}
								style={{ minWidth: '102px' }}
								onClick={() => loadData()}
							>
								{dashboardIsLoading ? <MicroSpinner /> : t('dashboard.buttons.refresh')}
							</ButtonTertiary>
						</ButtonContainer>
					</ContainerHeader>
					<CollRatios state={{ debtData }} />
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
					<BarCharts debtData={debtData} escrowData={escrowData} />
					<BalanceTable debtData={debtData} />
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

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
	successQueue: getSuccessQueue(state),
	walletBalances: getWalletBalances(state),
	walletBalancesWithRates: getWalletBalancesWithRates(state),
	rates: getRates(state),
});

const mapDispatchToProps = {
	showModal,
	fetchBalances,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
