import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { formatCurrency, bigNumberFormatter } from '../../../helpers/formatters';
import { setCurrentTab } from '../../../ducks/ui';
import { getWalletDetails } from '../../../ducks/wallet';
import {
	fetchDepotHistory,
	getDepotHistory,
	getIsFetchingDepotHistory,
} from '../../../ducks/depotHistory';
import ExpandableTable from './ExpandableTable';
import { getEtherscanAddressLink } from '../../../helpers/explorers';
import { TRANSACTION_EVENTS_MAP } from '../../../constants/transactionHistory';

import { PageTitle, PLarge, H2, H5, TableDataMedium } from '../../../components/Typography';
import PageContainer from '../../../components/PageContainer';
import { ButtonTertiary } from '../../../components/Button';
import Spinner from '../../../components/Spinner';
import DepotAction from '../../DepotActions';

const initialScenario = null;

const buttonLabelMapper = label => {
	switch (label) {
		case 'deposit':
			return 'depot.buttons.deposit';
		case 'withdraw':
			return 'depot.buttons.withdraw';
		default:
			return '';
	}
};

const Depot = ({
	walletDetails: { currentWallet, networkId },
	setCurrentTab,
	fetchDepotHistory,
	isFetchingDepotHistory,
	depotHistory,
}) => {
	const [deposits, setDeposits] = useState({});
	const [onChainDepotData, setOnChainDepotData] = useState({});
	const [isFechingOnChainDepotData, setIsFetchingOnChainDepotData] = useState(false);

	useEffect(() => {
		if (!currentWallet) return;
		const fetchDepotData = async () => {
			try {
				setIsFetchingOnChainDepotData(true);
				const results = await Promise.all([
					snxJSConnector.snxJS.Depot.totalSellableDeposits(),
					snxJSConnector.snxJS.Depot.minimumDepositAmount(),
					snxJSConnector.snxJS.sUSD.balanceOf(currentWallet),
				]);
				const [totalSellableDeposits, minimumDepositAmount, sUSDBalance] = results.map(
					bigNumberFormatter
				);
				setOnChainDepotData({
					totalSellableDeposits,
					minimumDepositAmount,
					sUSDBalance,
				});
				setIsFetchingOnChainDepotData(false);
			} catch (e) {
				console.log(e);
				setIsFetchingOnChainDepotData(false);
			}
		};
		fetchDepotData();
		fetchDepotHistory(currentWallet);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet]);

	useEffect(() => {
		if (!depotHistory || isEmpty(depotHistory)) return;
		const { cleared, deposited, removed } = depotHistory;

		const totalDeposited = sumBy(deposited, 'amount');
		const totalCleared = sumBy(cleared, 'toAmount');
		const totalRemoved = sumBy(removed, 'amount');

		const depositsWithDetails = deposited
			.filter(deposit => {
				return !removed.find(
					depositRemoved => depositRemoved.depositIndex === deposit.depositIndex
				);
			})
			.map(deposit => {
				let remaining = deposit.amount;
				let details = cleared
					.filter(depositCleared => depositCleared.depositIndex === deposit.depositIndex)
					.map(depositCleared => {
						remaining -= depositCleared.toAmount;
						return {
							...depositCleared,
							rate: depositCleared.toAmount / depositCleared.fromETHAmount,
							date: format(depositCleared.timestamp, 'H:mm | d MMM yy'),
						};
					});
				return {
					amount: deposit.amount,
					date: format(deposit.timestamp, 'H:mm | d MMM yy'),
					remaining,
					details,
				};
			});
		setDeposits({
			history: depositsWithDetails,
			availableAmount: Math.max(0, totalDeposited - totalCleared - totalRemoved),
		});
	}, [depotHistory]);

	const { t } = useTranslation();
	const [currentScenario, setCurrentScenario] = useState(initialScenario);

	const { totalSellableDeposits, sUSDBalance, minimumDepositAmount } = onChainDepotData;

	const props = {
		onDestroy: () => setCurrentScenario(null),
		sUSDBalance,
		availableAmount: deposits.availableAmount,
		minimumDepositAmount,
	};

	return (
		<PageContainer>
			<DepotAction action={currentScenario} {...props} />
			<PageTitle>
				{t('depot.intro.title')} ${formatCurrency(totalSellableDeposits)} sUSD
			</PageTitle>
			<PLarge>{t('depot.intro.subtitle')}</PLarge>
			<ButtonRow>
				{['deposit', 'withdraw'].map(action => {
					return (
						<Button key={action} onClick={() => setCurrentScenario(action)}>
							<ButtonContainer>
								<ActionImage src={`/images/actions/${action}.svg`} />
								<H2>{t(buttonLabelMapper(action))}</H2>
								{action === 'withdraw' ? (
									<Fragment>
										<PLarge>{t('depot.buttons.available')}</PLarge>
										<Amount>
											$
											{action === 'deposit'
												? formatCurrency(sUSDBalance)
												: formatCurrency(deposits.availableAmount)}{' '}
											sUSD
										</Amount>
									</Fragment>
								) : null}
							</ButtonContainer>
						</Button>
					);
				})}
			</ButtonRow>
			<Activity>
				<ActivityHeader>
					<H5 marginTop="10px">{t('depot.table.title')}</H5>
					<MoreButtons>
						<ButtonTertiary
							onClick={() =>
								setCurrentTab({
									tab: 'transactionsHistory',
									params: {
										filters: [
											TRANSACTION_EVENTS_MAP.deposit,
											TRANSACTION_EVENTS_MAP.withdrawl,
											TRANSACTION_EVENTS_MAP.cleared,
											TRANSACTION_EVENTS_MAP.bought,
										],
									},
								})
							}
						>
							{t('depot.buttons.more')}
						</ButtonTertiary>
						<ButtonTertiary
							href={getEtherscanAddressLink(networkId, snxJSConnector.snxJS.Depot.contract.address)}
							as="a"
							target="_blank"
						>
							{t('depot.buttons.contract')}
						</ButtonTertiary>
					</MoreButtons>
				</ActivityHeader>
				{deposits.history && deposits.history.length > 0 ? (
					<ExpandableTable deposits={deposits.history} />
				) : (
					<TablePlaceholder>
						{isFetchingDepotHistory || isFechingOnChainDepotData ? (
							<Spinner></Spinner>
						) : (
							<TableDataMedium>{t('general.noData')}</TableDataMedium>
						)}
					</TablePlaceholder>
				)}
			</Activity>
		</PageContainer>
	);
};

const ButtonRow = styled.div`
	display: flex;
	justify-content: space-between;
	margin: 32px auto 48px auto;
`;

const Button = styled.button`
	cursor: pointer;
	width: 48%;
	height: 300px;
	background-color: ${props => props.theme.colorStyles.panelButton};
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 5px;
	box-shadow: 0px 5px 10px 5px ${props => props.theme.colorStyles.shadow1};
	transition: transform ease-in 0.2s;
	&:hover {
		background-color: ${props => props.theme.colorStyles.panelButtonHover};
		box-shadow: 0px 5px 10px 8px ${props => props.theme.colorStyles.shadow1};
		transform: translateY(-2px);
	}
	&:disabled {
		pointer-events: none;
		opacity: 0.5;
	}
`;

const ButtonContainer = styled.div`
	max-width: 300px;
	margin: 0 auto;
`;

const ActionImage = styled.img`
	height: 48px;
	width: 48px;
`;

const Amount = styled.span`
	color: ${props => props.theme.colorStyles.body};
	font-family: 'apercu-medium';
	font-size: 24px;
	margin: 8px 0px 0px 0px;
`;

const Activity = styled.div`
	min-height: 400px;
`;

const ActivityHeader = styled.span`
	height: auto;
	display: flex;
	width: 100%;
	justify-content: space-between;
	margin-bottom: 32px;
`;

const MoreButtons = styled.span`
	height: auto;
	display: flex;
	& > :first-child {
		margin-right: 8px;
	}
`;

const TablePlaceholder = styled.div`
	display: flex;
	height: 100%;
	align-items: center;
	justify-content: center;
`;

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
	depotHistory: getDepotHistory(state),
	isFetchingDepotHistory: getIsFetchingDepotHistory(state),
});

const mapDispatchToProps = {
	setCurrentTab,
	fetchDepotHistory,
};

export default connect(mapStateToProps, mapDispatchToProps)(Depot);
