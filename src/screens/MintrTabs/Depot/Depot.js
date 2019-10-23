import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Store } from '../../../store';
import { format } from 'date-fns';
import { withTranslation, useTranslation } from 'react-i18next';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { formatCurrency, bigNumberFormatter } from '../../../helpers/formatters';

import {
	PageTitle,
	PLarge,
	H2,
	H5,
	TableDataMedium,
	TableHeaderMedium,
	DataLarge,
} from '../../../components/Typography';
import PageContainer from '../../../components/PageContainer';
import { ButtonTertiary, BorderlessButton } from '../../../components/Button';
import { HeaderRow, BodyRow, Cell, HeaderCell, ExpandableRow } from '../../../components/List';
import { Plus, Minus } from '../../../components/Icons';
import Spinner from '../../../components/Spinner';

import DepotAction from '../../DepotActions';
import { updateCurrentTab } from '../../../ducks/ui';

const sumBy = (collection, key) => {
	return collection.reduce((acc, curr) => {
		return acc + curr[key];
	}, 0);
};

const initialScenario = null;

const HiddenContent = ({ data }) => {
	const { t } = useTranslation();
	const {
		state: {
			wallet: { networkName },
		},
	} = useContext(Store);
	return (
		<HiddenContentWrapper>
			<HiddenTable style={{ width: '100%' }}>
				<HiddenTableHead>
					<HiddenTableRow>
						{['Activity', 'Amount', 'Rate', 'Time | Date', ''].map(headerElement => {
							return (
								<HiddenTableHeaderCell key={headerElement}>
									<DataLarge style={{ fontSize: '14px' }}>{headerElement}</DataLarge>
								</HiddenTableHeaderCell>
							);
						})}
					</HiddenTableRow>
				</HiddenTableHead>
				<HiddenTableBody>
					{data.map((detail, i) => {
						return (
							<HiddenTableRow key={i}>
								<HiddenTableCell>
									<HiddenTableCellContainer>
										<TypeImage src="/images/actions/tiny-sold.svg" />
										<TableDataMedium>{t('Sold by Depot')}</TableDataMedium>
									</HiddenTableCellContainer>
								</HiddenTableCell>
								<HiddenTableCell>
									<TableDataMedium>{formatCurrency(detail.amount)} sUSD</TableDataMedium>
								</HiddenTableCell>
								<HiddenTableCell>
									<TableDataMedium>{formatCurrency(detail.rate)} sUSD / ETH</TableDataMedium>
								</HiddenTableCell>
								<HiddenTableCell>
									<TableDataMedium>{format(detail.date, 'H:mm | d MMM yy')}</TableDataMedium>
								</HiddenTableCell>
								<HiddenTableCell>
									<BorderlessButton
										href={`https://${
											networkName === 'mainnet' ? '' : networkName + '.'
										}etherscan.io/tx/${detail.transactionHash}`}
										as="a"
										target="_blank"
									>
										{t('button.navigation.view')}
									</BorderlessButton>
								</HiddenTableCell>
							</HiddenTableRow>
						);
					})}
				</HiddenTableBody>
			</HiddenTable>
		</HiddenContentWrapper>
	);
};

const ExpandableTable = ({ data }) => {
	const { depositsMade } = data;
	const [expandedElements, setExpanded] = useState([]);
	return (
		<List>
			<HeaderRow>
				{['Type', 'Amount', 'Remaining', 'Time | Date', 'Details'].map(headerElement => {
					return (
						<HeaderCell key={headerElement}>
							<TableHeaderMedium>{headerElement}</TableHeaderMedium>
						</HeaderCell>
					);
				})}
			</HeaderRow>
			{depositsMade.map((deposit, i) => {
				const isExpanded = expandedElements.includes(i);
				const hasDetails = deposit.details && deposit.details.length > 0;
				return (
					<ExpandableRow key={i} expanded={isExpanded}>
						<BodyRow
							key={i}
							onClick={() => {
								if (!hasDetails) return;
								setExpanded(currentExpandedState => {
									if (currentExpandedState.includes(i)) {
										return currentExpandedState.filter(state => state !== i);
									} else return [...currentExpandedState, i];
								});
							}}
						>
							<Cell>
								<TypeImage src="/images/actions/tiny-deposit.svg" />
								<TableDataMedium>Deposit</TableDataMedium>
							</Cell>
							<Cell>
								<TableDataMedium>{formatCurrency(deposit.amount)} sUSD</TableDataMedium>
							</Cell>
							<Cell>
								<TableDataMedium>{formatCurrency(deposit.remaining)} sUSD</TableDataMedium>
							</Cell>
							<Cell>
								<TableDataMedium>{format(deposit.date, 'H:mm | d MMM yy')}</TableDataMedium>
							</Cell>
							<Cell>
								{isExpanded ? <Minus /> : <Plus style={{ opacity: hasDetails ? '1' : '0.3' }} />}
							</Cell>
						</BodyRow>
						<HiddenContent data={deposit.details} />
					</ExpandableRow>
				);
			})}
		</List>
	);
};

const getApiUrl = networkName =>
	`https://${networkName === 'mainnet' ? '' : networkName + '.'}api.synthetix.io/api`;

const useGetDepotEvents = (walletAddress, networkName) => {
	const [data, setData] = useState({});
	useEffect(() => {
		const getDepotEvents = async () => {
			try {
				setData({ loadingEvents: true });
				const results = await Promise.all([
					fetch(
						`${getApiUrl(
							networkName
						)}/blockchainEventsFiltered?fromAddress=${walletAddress}&eventName=SynthDeposit`
					),
					fetch(
						`${getApiUrl(
							networkName
						)}/blockchainEventsFiltered?toAddress=${walletAddress}&eventName=ClearedDeposit`
					),
					fetch(
						`${getApiUrl(
							networkName
						)}/blockchainEventsFiltered?fromAddress=${walletAddress}&eventName=SynthDepositRemoved`
					),
				]);

				const [depositsMade, depositsCleared, depositsRemoved] = await Promise.all(
					results.map(response => response.json())
				);

				const totalDepositsMade = sumBy(depositsMade, 'value');
				const totalDepositsCleared = sumBy(depositsCleared, 'toAmount');
				const totalDepositsRemoved = sumBy(depositsRemoved, 'value');
				const depositsMadeFiltered = depositsMade
					.filter(depositMade => {
						return !depositsRemoved.find(
							depositRemoved => depositRemoved.depositIndex === depositMade.depositIndex
						);
					})
					.map(deposit => {
						let remaining = deposit.value;
						let details = depositsCleared
							.filter(d => d.depositIndex === deposit.depositIndex)
							.map(d => {
								remaining -= d.toAmount;
								return {
									amount: d.toAmount,
									rate: d.toAmount / d.fromETHAmount,
									date: new Date(d.blockTimestampDate),
									transactionHash: d.transactionHash,
								};
							});
						return {
							amount: deposit.value,
							date: new Date(deposit.blockTimestampDate),
							remaining,
							details,
						};
					});
				setData({
					loadingEvents: false,
					amountAvailable: Math.max(
						0,
						totalDepositsMade - totalDepositsCleared - totalDepositsRemoved
					),
					depositsMade: depositsMadeFiltered,
				});
			} catch (e) {
				console.log(e);
				setData({ loadingEvents: false });
			}
		};
		getDepotEvents();
	}, [walletAddress, networkName]);
	return data;
};
const useGetDepotData = walletAddress => {
	const [data, setData] = useState({});
	useEffect(() => {
		const getDepotData = async () => {
			try {
				setData({ loadingData: true });
				const results = await Promise.all([
					snxJSConnector.snxJS.Depot.totalSellableDeposits(),
					snxJSConnector.snxJS.Depot.minimumDepositAmount(),
					snxJSConnector.snxJS.sUSD.balanceOf(walletAddress),
				]);
				const [totalSellableDeposits, minimumDepositAmount, sUSDBalance] = results.map(
					bigNumberFormatter
				);
				setData({
					loadingData: false,
					totalSellableDeposits,
					minimumDepositAmount,
					sUSDBalance,
				});
			} catch (e) {
				console.log(e);
				setData({ loadingData: false });
			}
		};
		getDepotData();
	}, [walletAddress]);
	return data;
};

const Depot = ({ t }) => {
	const [currentScenario, setCurrentScenario] = useState(initialScenario);
	const {
		state: {
			wallet: { currentWallet, networkName },
		},
		dispatch,
	} = useContext(Store);
	const { totalSellableDeposits, sUSDBalance, loadingData, minimumDepositAmount } = useGetDepotData(
		currentWallet
	);
	const { amountAvailable, depositsMade, loadingEvents } = useGetDepotEvents(
		currentWallet,
		networkName
	);

	const props = {
		onDestroy: () => setCurrentScenario(null),
		sUSDBalance,
		amountAvailable,
		minimumDepositAmount,
	};

	return (
		<PageContainer>
			<DepotAction action={currentScenario} {...props} />
			<PageTitle>
				{t('depot.intro.pageTitle')} ${formatCurrency(totalSellableDeposits)} sUSD
			</PageTitle>
			<PLarge>{t('depot.intro.pageSubtitle')}</PLarge>
			<ButtonRow>
				{['deposit', 'withdraw'].map(action => {
					return (
						<Button key={action} onClick={() => setCurrentScenario(action)}>
							<ButtonContainer>
								<ActionImage src={`/images/actions/${action}.svg`} />
								<H2>{action}</H2>
								<PLarge>{t('depot.buttons.available')}</PLarge>
								<Amount>
									$
									{action === 'deposit'
										? formatCurrency(sUSDBalance)
										: formatCurrency(amountAvailable)}{' '}
									sUSD
								</Amount>
							</ButtonContainer>
						</Button>
					);
				})}
			</ButtonRow>
			<Activity>
				<ActivityHeader>
					<H5 marginTop="10px">{t('depot.table.title')}</H5>
					<MoreButtons>
						<ButtonTertiary onClick={() => updateCurrentTab('transactionsHistory', dispatch)}>
							{t('depot.buttons.more')}
						</ButtonTertiary>
						<ButtonTertiary
							href={`https://${
								networkName === 'mainnet' ? '' : networkName + '.'
							}etherscan.io/address/${snxJSConnector.snxJS.Depot.contract.address}`}
							as="a"
							target="_blank"
						>
							{t('depot.buttons.contract')}
						</ButtonTertiary>
					</MoreButtons>
				</ActivityHeader>
				{depositsMade && depositsMade.length > 0 ? (
					<ExpandableTable data={{ depositsMade }} />
				) : (
					<TablePlaceholder>
						{loadingEvents || loadingData ? (
							<Spinner></Spinner>
						) : (
							<TableDataMedium>No Data</TableDataMedium>
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

const TypeImage = styled.img`
	width: 16px;
	height: 16px;
	margin-right: 8px;
`;

const HiddenContentWrapper = styled.div`
	padding: 24px 16px;
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-top-width: 0;
`;

const HiddenTable = styled.table`
	width: 100%;
`;

const HiddenTableHead = styled.thead``;

const HiddenTableBody = styled.tbody``;

const HiddenTableHeaderCell = styled.th`
	padding-bottom: 5px;
	text-align: left;
	border-bottom: 1px solid ${props => props.theme.colorStyles.borders};
	:last-child {
		text-align: right;
	}
`;

const HiddenTableRow = styled.tr`
	:first-child {
		td {
			padding: 15px 0 5px 0;
		}
	}
`;

const HiddenTableCell = styled.td`
	padding: 5px 0;
	text-align: left;
	:last-child {
		text-align: right;
	}
`;

const HiddenTableCellContainer = styled.div`
	display: flex;
	align-items: center;
`;

const TablePlaceholder = styled.div`
	display: flex;
	height: 100%;
	align-items: center;
	justify-content: center;
`;

const List = styled.div`
	width: 100%;
`;

export default withTranslation()(Depot);
