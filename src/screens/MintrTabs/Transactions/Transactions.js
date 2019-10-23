/* eslint-disable */
import React, { Fragment, useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { formatCurrency } from '../../../helpers/formatters';
import Select from '../../../components/Select';

import Spinner from '../../../components/Spinner';

import { Table, THead, TBody, TH, TR, TD } from '../../../components/ScheduleTable';

import { DataLarge, TableHeaderMedium } from '../../../components/Typography';

import { Store } from '../../../store';

import PageContainer from '../../../components/PageContainer';
import Paginator from '../../../components/Paginator';
import { ButtonTertiary, BorderlessButton } from '../../../components/Button';

const PAGINATION_INDEX = 10;

const EVENT_LIST = [
	'Issued',
	'Burned',
	'FeesClaimed',
	'SynthExchange',
	'SynthDeposit',
	'SynthWithdrawal',
];

const getIconForEvent = event => {
	switch (event) {
		case 'Issued':
			return 'tiny-mint.svg';
		case 'Burned':
			return 'tiny-burn.svg';
		case 'FeesClaimed':
			return 'tiny-claim.svg';
		case 'SynthExchange':
			return 'tiny-trade.svg';
		case 'SynthDeposit':
			return 'tiny-deposit.svg';
		case 'SynthWithdrawal':
			return 'tiny-withdraw.svg';
	}
};

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
			const query = {
				fromAddress: walletAddress,
			};
			try {
				setData({ loading: true });
				const response = await fetch(
					`${getApiUrl(networkName)}blockchainEventsFiltered${stringifyQuery(query)}`
				);
				const transactions = await response.json();
				setData({
					loading: false,
					transactions: transactions.filter(transaction => EVENT_LIST.includes(transaction.event)),
				});
			} catch (e) {
				console.log(e);
				setData({ loading: false });
			}
		};
		getTransaction();
	}, [walletAddress]);
	return data;
};

const getEventInfo = data => {
	const event = data.event;
	let amount = `${formatCurrency(data.value || 0)} sUSD`;
	let type,
		imageUrl = '';
	switch (event) {
		case 'Issued':
			type = 'transactions.events.minted';
			imageUrl = getIconForEvent(event);
			break;
		case 'Burned':
			type = 'transactions.events.burned';
			imageUrl = getIconForEvent(event);
			break;
		case 'FeesClaimed':
			amount = `${formatCurrency(data.snxRewards || 0)} SNX`;
			type = 'transactions.events.claimedFees';
			imageUrl = getIconForEvent(event);
			break;
		case 'SynthExchange':
			amount = `${formatCurrency(data.exchangeFromAmount)} ${
				data.exchangeFromCurrency
			} to ${formatCurrency(data.exchangeToAmount)} ${data.exchangeToCurrency}`;
			type = 'transactions.events.traded';
			imageUrl = getIconForEvent(event);
			break;
		case 'SynthDeposit':
			type = 'transactions.events.deposited';
			imageUrl = getIconForEvent(event);
			break;
		case 'SynthWithdrawal':
			type = 'transactions.events.withdrawn';
			imageUrl = getIconForEvent(event);
			break;
		case 'ClearedDeposit':
			type = 'transactions.events.sold';
			imageUrl = getIconForEvent(event);
			break;
		default:
			return {};
	}
	return {
		type,
		imageUrl,
		amount,
	};
};

const TransactionsTable = ({ data }) => {
	const {
		state: {
			wallet: { networkName },
		},
	} = useContext(Store);
	const { t } = useTranslation();
	return (
		<TransactionsWrapper>
			<Table cellSpacing="0">
				<THead>
					<TR>
						{['Type', 'Amount', 'Time | Date', ''].map((headerElement, i) => {
							return (
								<TH style={{ textAlign: i === 2 ? 'right' : 'left' }} key={headerElement}>
									<TableHeaderMedium>{headerElement}</TableHeaderMedium>
								</TH>
							);
						})}
					</TR>
				</THead>

				<TBody>
					{data.map((dataElement, i) => {
						const { type, imageUrl, amount } = getEventInfo(dataElement);
						return (
							<TR key={i}>
								<TD>
									<TDInner>
										<TypeImage img src={`/images/actions/${imageUrl}`} />
										<DataLarge>{t(type)}</DataLarge>
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

const Transactions = () => {
	const [currentPage, setCurrentPage] = useState(0);
	const {
		state: {
			wallet: { currentWallet, networkName },
		},
	} = useContext(Store);
	const { loading, transactions } = useGetTransactions(currentWallet, networkName);

	return (
		<PageContainer>
			<Fragment>
				{/* <Filters>
          <Inputs>
            <InputContainer>
              <Select
                placeholder="type"
                data={EVENT_LIST.map(event => {
                  return {
                    label: event,
                    icon: `/images/actions/${getIconForEvent(event)}`,
                  };
                })}
              ></Select>
            </InputContainer>
            <InputContainer>
              <Select placeholder="dates"></Select>
            </InputContainer>
            <InputContainer>
              <Select placeholder="amount"></Select>
            </InputContainer>

            <ButtonTertiary>CLEAR FILTERS</ButtonTertiary>
          </Inputs>
        </Filters> */}
				<TransactionsPanel>
					{transactions && transactions.length > 0 ? (
						<TransactionsTable
							data={transactions.slice(
								PAGINATION_INDEX * currentPage,
								PAGINATION_INDEX * currentPage + PAGINATION_INDEX
							)}
						/>
					) : (
						<TransactionsPlaceholder>
							{loading ? <Spinner /> : <DataLarge>No Data</DataLarge>}
						</TransactionsPlaceholder>
					)}
					<Paginator
						disabled={loading || !transactions}
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

export default Transactions;
