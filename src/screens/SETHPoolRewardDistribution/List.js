import React, { Fragment, useContext, useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';

import { Store } from '../../store';

import Table from '../../components/Table';
import { PageTitle, ButtonPrimaryLabel, H5, PSmall } from '../../components/Typography';
import { ButtonTertiary } from '../../components/Button';

import COLORS from '../../styles/colors';

import { useOwners, useRequiredConfirmationCount, useTransactions } from './hooks';

const ExpandableList = ({ label, transactions, ...props }) => {
	const [showAll, setShowAll] = useState(false);
	const toggleShowAll = () => setShowAll(!showAll);
	return (
		<TableContainer>
			<LabelContainer>
				<H5 margin={0}>{label}</H5>
				<ButtonTertiary onClick={toggleShowAll}>{showAll ? 'See Less' : 'See More'}</ButtonTertiary>
			</LabelContainer>
			{React.cloneElement(props.children, {
				transactions: showAll ? transactions : transactions.slice(0, 3),
				...props,
			})}
		</TableContainer>
	);
};

const PendingList = ({ transactions, openDetails, isOwner }) => {
	const requiredConfirmationCount = useRequiredConfirmationCount();
	return (
		<Table
			header={[
				{ key: 'id', value: 'ID' },
				{ key: 'committed', value: 'committed' },
				{ key: 'signers', value: 'signers' },
				{ key: 'confirm', value: 'confirm' },
			]}
			data={transactions.map(item => {
				const disabled =
					!isOwner || item.youConfirmed || item.confirmationCount >= requiredConfirmationCount;
				return {
					id: item.id,
					committed: format(item.date, 'd-M-yy | HH:mm'),
					signers: `${item.confirmationCount}/${requiredConfirmationCount}`,
					confirm: (
						<Link onClick={() => openDetails(item)} disabled={disabled}>
							Confirm
						</Link>
					),
				};
			})}
		/>
	);
};

const CompletedList = ({ transactions, networkName }) => (
	<Table
		header={[
			{ key: 'id', value: 'ID' },
			{ key: 'completed', value: 'completed' },
			{ key: 'view', value: 'view on etherscan' },
		]}
		data={transactions.map(item => {
			return {
				id: item.id,
				completed: format(item.date, 'd-M-yy | HH:mm'),
				view: (
					<Link
						href={`https://${networkName === 'mainnet' ? '' : networkName + '.'}etherscan.io/tx/${
							item.transactionHash
						}`}
						as="a"
						target="_blank"
					>
						View
					</Link>
				),
			};
		})}
	/>
);

const List = ({ setPage, openDetails }) => {
	const {
		state: {
			wallet: { currentWallet, networkName },
		},
	} = useContext(Store);
	const owners = useOwners();
	const { loading, pendingTransactions, completedTransactions } = useTransactions();

	const isOwner = owners.includes(currentWallet.toLowerCase());

	return (
		<Fragment>
			{loading ? (
				<div>Loading...</div>
			) : (
				<PageContainer>
					<PageTitle fontSize={32} marginBottom={0} marginTop={20}>
						sETH Pool Reward Distribution
					</PageTitle>
					<SubtitleContainer></SubtitleContainer>
					<Button onClick={() => setPage('create')} disabled={!isOwner}>
						<ButtonPrimaryLabel>submit a new transaction</ButtonPrimaryLabel>
					</Button>
					{!isOwner && (
						<PSmall color={COLORS.light3}>
							Owner of the multisig but unable to submit or confirm a transaction? Please switch
							wallets.
						</PSmall>
					)}
					<ExpandableList
						transactions={pendingTransactions}
						openDetails={openDetails}
						isOwner={isOwner}
					>
						<PendingList />
					</ExpandableList>
					<ExpandableList transactions={completedTransactions} networkName={networkName}>
						<CompletedList />
					</ExpandableList>
				</PageContainer>
			)}
		</Fragment>
	);
};

const PageContainer = styled('div')`
	display: flex;
	flex-direction: column;
	align-items: center;
	background: ${props => props.theme.colorStyles.panels};
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: ${props => (props.curved ? '40px' : '5px')};
	padding: 50px;
`;

const TableContainer = styled('div')`
	display: flex;
	flex-direction: column;
	width: 100%;
`;

const Button = styled.button`
	width: 540px;
	height: 64px;
	border-radius: 5px;
	text-transform: uppercase;
	border: none;
	cursor: pointer;
	background-color: ${props => props.theme.colorStyles.buttonPrimaryBg};
	transition: all ease-in 0.1s;
	&:hover {
		background-color: ${props => props.theme.colorStyles.buttonPrimaryBgFocus};
	}
	margin-bottom: 10px;
	&:disabled {
		background-color: ${props => props.theme.colorStyles.buttonPrimaryBgDisabled};
		cursor: default;
	}
`;

const Link = styled('button')`
	cursor: pointer;
	color: ${COLORS.buttonLight};
	underline: none;
	text-transform: uppercase;
	padding: 0;
	border: none;
	font-size: 12px;
	text-decoration: none;
	&:hover {
		color: ${COLORS.buttonDark};
	}
	&:disabled {
		opacity: 0.5;
		cursor: default;
	}
`;

const SubtitleContainer = styled.div`
	width: 500px;
	text-align: center;
	margin: 15px 0;
`;

const LabelContainer = styled.div`
	width: 100%;
	margin-top: 30px;
	margin-bottom: 20px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

export default List;
