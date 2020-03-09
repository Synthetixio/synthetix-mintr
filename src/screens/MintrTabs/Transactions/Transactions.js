import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import orderBy from 'lodash/orderBy';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { format, isWithinInterval } from 'date-fns';
import { formatCurrency } from '../../../helpers/formatters';
import Select from '../../../components/Select';

import Spinner from '../../../components/Spinner';

import { Table, THead, TBody, TH, TR, TD } from '../../../components/ScheduleTable';

import { DataLarge, TableHeaderMedium } from '../../../components/Typography';

import PageContainer from '../../../components/PageContainer';
import Paginator from '../../../components/Paginator';
import { ButtonTertiary, BorderlessButton } from '../../../components/Button';

import { getTabParams } from '../../../ducks/ui';
import { getWalletDetails } from '../../../ducks/wallet';

const PAGINATION_INDEX = 10;

const EVENT_LIST = [
	{ key: 'Issued', label: 'transactions.events.minted', icon: 'tiny-mint.svg' },
	{ key: 'Burned', label: 'transactions.events.burned', icon: 'tiny-burn.svg' },
	{ key: 'FeesClaimed', label: 'transactions.events.claimedFees', icon: 'tiny-claim.svg' },
	{ key: 'SynthExchange', label: 'transactions.events.traded', icon: 'tiny-trade.svg' },
	{ key: 'SynthDeposit', label: 'transactions.events.deposited', icon: 'tiny-deposit.svg' },
	{ key: 'SynthWithdrawal', label: 'transactions.events.withdrawn', icon: 'tiny-withdraw.svg' },
	{ key: 'ClearedDeposit', label: 'transactions.events.sold', icon: 'tiny-cleared-deposit.svg' },
	{ key: 'Exchange', label: 'transactions.events.exchanged', icon: 'tiny-bought.svg' },
];

const stringifyQuery = query => {
	return (query = Object.keys(query).reduce((acc, next, index) => {
		if (index > 0) {
			acc += '&';
		}
		acc += `${next}=${query[next]}`;
		return acc;
	}, '?'));
};

const getApiUrl = networkName =>
	`https://${networkName === 'mainnet' ? '' : networkName + '.'}api.synthetix.io/api/`;

const useGetTransactions = (walletAddress, networkName) => {
	const [data, setData] = useState({});
	useEffect(() => {
		const getTransaction = async () => {
			try {
				setData({ loading: true });
				const response = await Promise.all([
					fetch(
						`${getApiUrl(networkName)}blockchainEventsFiltered${stringifyQuery({
							fromAddress: walletAddress,
						})}`
					),
					fetch(
						`${getApiUrl(networkName)}blockchainEventsFiltered${stringifyQuery({
							toAddress: walletAddress,
							event: 'ClearedDeposit',
						})}`
					),
				]);
				const [transactions, clearedDeposits] = await Promise.all(
					response.map(result => result.json())
				);
				//filtering out outgoing ClearedDeposits
				const filteredTransactions = transactions
					.filter(
						tx => tx.event !== 'ClearedDeposit' && EVENT_LIST.find(event => event.key === tx.event)
					)
					.concat(clearedDeposits)
					.map(transactions => {
						const eventInfo = EVENT_LIST.find(event => transactions.event === event.key);
						return {
							...transactions,
							...eventInfo,
						};
					});

				setData({
					loading: false,
					transactions: orderBy(filteredTransactions, ['blockTimestamp'], ['desc']),
				});
			} catch (e) {
				console.log(e);
				setData({ loading: false });
			}
		};
		getTransaction();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [walletAddress]);
	return data;
};

const getEventInfo = data => {
	const event = data.event;
	let amount = `${formatCurrency(data.value || 0)} sUSD`;
	let { label, icon } = data;
	switch (event) {
		case 'FeesClaimed':
			amount = `${formatCurrency(data.snxRewards || 0)} SNX`;
			break;
		case 'SynthExchange': {
			const fromCurrency = data.exchangeFromCurrency.replace(/\u0000/g, '');
			const toCurrency = data.exchangeToCurrency.replace(/\u0000/g, '');
			amount = `${formatCurrency(data.exchangeFromAmount)} ${fromCurrency} / ${formatCurrency(
				data.exchangeToAmount
			)} ${toCurrency}`;
			break;
		}
		case 'ClearedDeposit':
			amount = `${formatCurrency(data.toAmount)} ${data.token} (${formatCurrency(
				data.fromETHAmount
			)} ETH)`;
			break;
		case 'Exchange':
			if (data.exchangeFromCurrency === 'ETH') {
				label = 'transactions.events.exchanged';
			} else {
				label = 'transactions.events.sold';
			}
			amount = `${formatCurrency(data.exchangeToAmount)} ${
				data.exchangeToCurrency
			} (${formatCurrency(data.exchangeFromAmount)} ${data.exchangeFromCurrency})`;
			break;
	}
	return {
		label,
		icon,
		amount,
	};
};

const filterTransactions = (transactions, filters) => {
	const { events, dates, amount } = filters;
	if (!transactions || !transactions.length) return transactions;
	return transactions.filter(t => {
		if (events.length) {
			if (!events.includes(t.event)) return;
		}

		if (dates.from) {
			if (!isWithinInterval(new Date(t.createdAt), { start: dates.from, end: dates.to })) return;
		}

		if (!isNaN(amount.from) && !isNaN(amount.to)) {
			if (t.value < amount.from || t.value > amount.to) return;
			if (t.snxRewards < amount.from || t.snxRewards > amount.to) return;
			if (t.exchangeFromAmount < amount.from || t.exchangeFromAmount > amount.to) return;
			if (t.exchangeToAmount < amount.from || t.exchangeToAmount > amount.to) return;
		}

		return true;
	});
};

const TransactionsTable = ({ data, networkName }) => {
	const { t } = useTranslation();

	return (
		<TransactionsWrapper>
			<Table cellSpacing="0">
				<THead>
					<TR>
						{[
							'transactions.filters.type',
							'transactions.filters.amount',
							'transactions.filters.date',
							'',
						].map((headerElement, i) => {
							return (
								<TH style={{ textAlign: i === 2 ? 'right' : 'left' }} key={headerElement}>
									<TableHeaderMedium>{t(headerElement)}</TableHeaderMedium>
								</TH>
							);
						})}
					</TR>
				</THead>

				<TBody>
					{data.map((dataElement, i) => {
						const { label, icon, amount } = getEventInfo(dataElement);
						return (
							<TR key={i}>
								<TD>
									<TDInner>
										<TypeImage img src={`/images/actions/${icon}`} />
										<DataLarge>{t(label)}</DataLarge>
									</TDInner>
								</TD>
								<TD>
									<DataLarge>{amount}</DataLarge>
								</TD>
								<TD style={{ textAlign: 'right' }}>
									<DataLarge>
										{format(new Date(dataElement.createdAt), 'hh:mm | d MMM yy')}
									</DataLarge>
								</TD>
								<TD style={{ textAlign: 'right' }}>
									<BorderlessButton
										href={`https://${
											networkName === 'mainnet' ? '' : networkName + '.'
										}etherscan.io/tx/${dataElement.transactionHash}`}
										as="a"
										target="_blank"
									>
										{t('button.navigation.view')}
									</BorderlessButton>
								</TD>
							</TR>
						);
					})}
				</TBody>
			</Table>
		</TransactionsWrapper>
	);
};

const Transactions = ({ tabParams, walletDetails }) => {
	const { t } = useTranslation();
	const { currentWallet, networkName } = walletDetails;
	const [currentPage, setCurrentPage] = useState(0);
	const [filters, setFilters] = useState({
		events: (tabParams && tabParams.filters) || [],
		dates: { from: undefined, to: undefined },
		amount: { from: undefined, to: undefined },
	});

	const clearFilters = () => {
		setFilters({
			events: [],
			dates: { from: undefined, to: undefined },
			amount: { from: undefined, to: undefined },
		});
	};

	const { loading, transactions } = useGetTransactions(currentWallet, networkName);
	const filteredTransactions = filterTransactions(transactions, filters);
	return (
		<PageContainer>
			<Fragment>
				<Filters>
					<Inputs>
						<InputContainer>
							<Select
								placeholder={t('transactions.filters.type')}
								data={EVENT_LIST}
								selected={filters.events}
								onSelect={selected => setFilters({ ...filters, ...{ events: selected } })}
							></Select>
						</InputContainer>
						<InputContainer>
							<Select
								placeholder={t('transactions.filters.date')}
								type="calendar"
								selected={filters.dates}
								onSelect={selected => setFilters({ ...filters, ...{ dates: selected } })}
							></Select>
						</InputContainer>
						<InputContainer>
							<Select
								placeholder={t('transactions.filters.amount')}
								type="range"
								selected={filters.amount}
								onSelect={selected => setFilters({ ...filters, ...{ amount: selected } })}
							></Select>
						</InputContainer>

						<ButtonTertiary style={{ textTransform: 'uppercase' }} onClick={clearFilters}>
							{t('transactions.buttons.clearFilters')}
						</ButtonTertiary>
					</Inputs>
				</Filters>
				<TransactionsPanel>
					{filteredTransactions && filteredTransactions.length > 0 ? (
						<TransactionsTable
							data={filteredTransactions.slice(
								PAGINATION_INDEX * currentPage,
								PAGINATION_INDEX * currentPage + PAGINATION_INDEX
							)}
							networkName={networkName}
						/>
					) : (
						<TransactionsPlaceholder>
							{loading ? <Spinner /> : <DataLarge>No Data</DataLarge>}
						</TransactionsPlaceholder>
					)}
					<Paginator
						disabled={loading || !filteredTransactions}
						currentPage={currentPage}
						onPageChange={page => setCurrentPage(page)}
					/>
				</TransactionsPanel>
			</Fragment>
		</PageContainer>
	);
};

const Filters = styled.div`
	width: 100%;
	height: 88px;
	padding: 24px;
	background-color: ${props => props.theme.colorStyles.panels};
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 2px;
	box-shadow: 0px 2px 10px 2px ${props => props.theme.colorStyles.shadow1};
	margin-bottom: 24px;
`;

const InputContainer = styled.div`
	flex: 1;
	padding: 0 5px;
`;

const Inputs = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	height: 90%;
`;

const TransactionsPanel = styled.div`
	width: 100%;
	padding: 32px;
	background-color: ${props => props.theme.colorStyles.panels};
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 2px;
	box-shadow: 0px 2px 10px 2px ${props => props.theme.colorStyles.shadow1};
`;

const TransactionsWrapper = styled.div`
	height: auto;
	width: 100%;
`;

const TypeImage = styled.img`
	width: 16px;
	height: 16px;
	margin-right: 8px;
`;

const TDInner = styled.div`
	display: flex;
	align-items: center;
`;

const TransactionsPlaceholder = styled.div`
	width: 100%;
	height: 600px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const mapStateToProps = state => ({
	tabParams: getTabParams(state),
	walletDetails: getWalletDetails(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
