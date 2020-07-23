import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { isWithinInterval } from 'date-fns';
import Select from '../../../components/Select';

import {
	fetchTransactionHistory,
	getTransactionHistory,
	getIsFetchedTransactionHistory,
	getIsFetchingTransactionHistory,
	getIsRefreshingTransactionHistory,
	getTransactionHistoryFetchError,
} from '../../../ducks/transactionHistory';

import { PAGINATION_INDEX, TRANSACTION_EVENTS } from '../../../constants/transactionHistory';

import Spinner from '../../../components/Spinner';
import { DataLarge } from '../../../components/Typography';
import PageContainer from '../../../components/PageContainer';
import Paginator from './Paginator';
import { ButtonTertiary } from '../../../components/Button';
import Table from './Table';

import { getTabParams } from '../../../ducks/ui';
import { getWalletDetails } from '../../../ducks/wallet';

const filterTransactions = (transactions, filters) => {
	const { events, dates, amount } = filters;
	return transactions.filter(t => {
		if (events.length > 0) {
			if (!events.includes(t.type)) return null;
		}

		if (dates.from) {
			if (!isWithinInterval(new Date(t.timestamp), { start: dates.from, end: dates.to }))
				return null;
		}

		if (!isNaN(amount.from) && !isNaN(amount.to)) {
			if (t.value < amount.from || t.value > amount.to) return null;
			if (t.amount < amount.from || t.amount > amount.to) return null;
			if (t.fromAmount < amount.from || t.fromAmount > amount.to) return null;
		}

		return true;
	});
};

const Transactions = ({
	tabParams,
	walletDetails: { currentWallet, networkName },
	fetchTransactionHistory,
	transactionHistory,
	isFetchingTransactionHistory,
}) => {
	const { t } = useTranslation();
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

	useEffect(() => {
		if (currentWallet) fetchTransactionHistory(currentWallet);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet]);

	const filteredTransactions = filterTransactions(transactionHistory, filters).slice(
		PAGINATION_INDEX * currentPage,
		PAGINATION_INDEX * currentPage + PAGINATION_INDEX
	);

	return (
		<PageContainer>
			<Fragment>
				<Filters>
					<Inputs>
						<InputContainer>
							<Select
								placeholder={t('transactions.filters.type')}
								data={TRANSACTION_EVENTS}
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
					{!isFetchingTransactionHistory ? (
						<Table data={filteredTransactions} networkName={networkName} />
					) : (
						<TransactionsPlaceholder>
							{isFetchingTransactionHistory ? <Spinner /> : <DataLarge>No Data</DataLarge>}
						</TransactionsPlaceholder>
					)}
					<Paginator
						disabled={isFetchingTransactionHistory || transactionHistory.length === 0}
						currentPage={currentPage}
						lastPage={Math.trunc(transactionHistory.length / PAGINATION_INDEX) + 1}
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
	transactionHistory: getTransactionHistory(state),
	isFetchedTransactionHistory: getIsFetchedTransactionHistory(state),
	isFetchingTransactionHistory: getIsFetchingTransactionHistory(state),
	isRefreshingTransactionHistory: getIsRefreshingTransactionHistory(state),
	fetchTransactionHistoryError: getTransactionHistoryFetchError(state),
});

const mapDispatchToProps = {
	fetchTransactionHistory,
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
