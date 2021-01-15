import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ethers, providers } from 'ethers';
import { intervalToDuration, format } from 'date-fns';
import { Watcher } from '@eth-optimism/watcher';

import { getCurrentWallet } from 'ducks/wallet';
import { getDebtStatusData } from 'ducks/debtStatus';

import PageContainer from 'components/PageContainer';
import { PageTitle, PLarge } from 'components/Typography';
import { TABLE_PALETTE } from 'components/Table/constants';
import Table from 'components/Table';
import snxJSConnector from 'helpers/snxJSConnector';
import useInterval from 'hooks/useInterval';
import { MicroSpinner } from 'components/Spinner';
import { FlexDivCentered } from 'styles/common';
import { formatCurrency } from 'helpers/formatters';
import { ExternalLink } from 'styles/common';
import { getEtherscanTxLink } from 'helpers/explorers';
import {
	INFURA_JSON_RPC_URLS,
	L1_MESSENGER_ADDRESS,
	L2_MESSENGER_ADDRESS,
} from 'helpers/networkHelper';

const NUM_BLOCKS_TO_FETCH = 10000000;
const INTERVAL_TIMER = 60 * 1000;

const getCountdown = durationObject => {
	const { days, hours, minutes } = durationObject;
	if (days) {
		return `${days} days ${hours} hours ${minutes} minutes`;
	} else if (hours) {
		return `${hours} hours ${minutes} minutes`;
	} else if (minutes) {
		return `${minutes} minute(s)`;
	} else return 'less than a minute';
};

const Withdrawals = ({ currentWallet, debtStatus }) => {
	const [submittedWithdrawals, setSubmittedWithdrawals] = useState(null);
	const [isFetchingSubmittedWithdrawals, setIsFetchingSubmittedWithdrawals] = useState(false);
	const [pendingWithdrawals, setPendingWithdrawals] = useState(null);
	const [isFetchingPendingWithdrawals, setIsFetchingPendingWithdrawals] = useState(false);

	const fraudProofWindow = debtStatus?.fraudProofWindow ?? 0;

	const fetchSubmittedWithdrawals = async () => {
		const {
			provider,
			snxJS: { SynthetixBridgeToBase },
		} = snxJSConnector;
		const { hexZeroPad, id } = ethers.utils;

		try {
			setIsFetchingSubmittedWithdrawals(true);
			setIsFetchingPendingWithdrawals(true);
			const blockNumber = await provider.getBlockNumber();
			const startingBlock = Math.max(blockNumber - NUM_BLOCKS_TO_FETCH, 0);
			const filter = {
				address: SynthetixBridgeToBase.contract.address,
				topics: [id(`WithdrawalInitiated(address,uint256)`), hexZeroPad(currentWallet, 32)],
				fromBlock: startingBlock,
			};
			const logs = await provider.getLogs(filter);
			const events = await Promise.all(
				logs.map(async l => {
					const block = await provider.getBlock(l.blockNumber);
					const parsedLogs = SynthetixBridgeToBase.contract.interface.parseLog(l);
					const { amount } = parsedLogs.values;
					const timestamp = Number(block.timestamp * 1000);

					return {
						timestamp,
						isConfirmed: false,
						isOld: timestamp + fraudProofWindow < Date.now(),
						remaining: getCountdown(
							intervalToDuration({
								start: new Date(timestamp + fraudProofWindow),
								end: new Date(),
							})
						),
						transactionHash: l.transactionHash,
						amount: amount / 1e18,
					};
				})
			);
			let submitteds = [];
			let pendings = [];

			events.forEach(event => {
				if (event.isOld) {
					pendings.unshift(event);
				} else submitteds.push(event);
			});

			setSubmittedWithdrawals(submitteds);
			setIsFetchingSubmittedWithdrawals(false);

			const watcher = new Watcher({
				l1: {
					provider: new providers.JsonRpcProvider(INFURA_JSON_RPC_URLS[42]),
					messengerAddress: L1_MESSENGER_ADDRESS,
				},
				l2: {
					provider: snxJSConnector.provider,
					messengerAddress: L2_MESSENGER_ADDRESS,
				},
			});
			const pendingsWithReceipt = await Promise.all(
				pendings.map(async event => {
					const msgHashes = await watcher.getMessageHashesFromL2Tx(event.transactionHash);
					const receipt = await watcher.getL1TransactionReceipt(msgHashes[0], false);
					return {
						...event,
						isConfirmed: !!receipt,
						transactionHash: receipt?.transactionHash ?? null,
					};
				})
			);
			setPendingWithdrawals(pendingsWithReceipt);
			setIsFetchingPendingWithdrawals(false);
		} catch (e) {
			console.log(e);
			setIsFetchingSubmittedWithdrawals(false);
			setIsFetchingPendingWithdrawals(false);
		}
	};

	useEffect(() => {
		if (currentWallet && fraudProofWindow) {
			fetchSubmittedWithdrawals();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet, fraudProofWindow]);

	useInterval(() => {
		if (currentWallet) {
			fetchSubmittedWithdrawals();
		}
	}, INTERVAL_TIMER);

	return (
		<PageContainer>
			<StyledPageTitle>Pending</StyledPageTitle>
			<PLarge>
				To withdraw your SNX from L2 back to L1, there is first a waiting period to confirm your
				transaction.
			</PLarge>
			<TableWrapper>
				{submittedWithdrawals && submittedWithdrawals.length > 0 ? (
					<Table
						data={submittedWithdrawals}
						palette={TABLE_PALETTE.STRIPED}
						columns={[
							{
								Header: 'amount',
								accessor: 'amount',
								Cell: ({ value }) => {
									return `${formatCurrency(value)} SNX`;
								},
								sortable: false,
							},
							{
								Header: 'remaining',
								accessor: 'remaining',
								Cell: ({ value }) => {
									return value;
								},
								sortable: false,
							},
							{
								Header: '',
								accessor: 'transactionHash',
								Cell: ({ value }) => {
									return (
										<StyledExternalLink href={getEtherscanTxLink(420, value)}>
											Verify
										</StyledExternalLink>
									);
								},
								sortable: false,
							},
						]}
					/>
				) : (
					<SpinnerWrapper>
						{isFetchingSubmittedWithdrawals ? (
							<MicroSpinner />
						) : (
							<StyledPLarge>No transaction</StyledPLarge>
						)}
					</SpinnerWrapper>
				)}
			</TableWrapper>
			<StyledPageTitle>Ready to be relayed</StyledPageTitle>
			<PLarge>
				Once your withdrawal has been through the waiting period, it must be picked up by the
				relayer to migrate your SNX from L2 back to L1.
			</PLarge>
			<TableWrapper>
				{pendingWithdrawals && pendingWithdrawals.length > 0 ? (
					<Table
						data={pendingWithdrawals}
						palette={TABLE_PALETTE.STRIPED}
						columns={[
							{
								Header: 'amount',
								accessor: 'amount',
								Cell: ({ value }) => {
									return `${formatCurrency(value)} SNX`;
								},
								sortable: false,
							},
							{
								Header: 'Date',
								accessor: 'timestamp',
								Cell: ({ value }) => {
									return format(new Date(value), 'dd LLL yy HH:mm');
								},
								sortable: false,
							},
							{
								Header: 'status',
								accessor: 'isConfirmed',
								Cell: ({ value }) => {
									return value ? 'Confirmed' : 'Pending';
								},
								sortable: false,
							},
							{
								Header: '',
								accessor: 'transactionHash',
								Cell: ({ value, row: { original } }) => {
									return value ? (
										<StyledExternalLink href={getEtherscanTxLink(420, value, original.isConfirmed)}>
											Verify
										</StyledExternalLink>
									) : null;
								},
								sortable: false,
							},
						]}
					/>
				) : (
					<SpinnerWrapper>
						{isFetchingPendingWithdrawals ? (
							<MicroSpinner />
						) : (
							<StyledPLarge>No transaction</StyledPLarge>
						)}
					</SpinnerWrapper>
				)}
			</TableWrapper>
		</PageContainer>
	);
};

const StyledExternalLink = styled(ExternalLink)`
	color: white;
	cursor: pointer;
	&:hover {
		text-decoration: underline;
	}
`;

const StyledPLarge = styled(PLarge)`
	font-family: 'apercu-bold';
`;

const SpinnerWrapper = styled(FlexDivCentered)`
	height: 80px;
	justify-content: center;
`;

const TableWrapper = styled.div`
	max-height: 250px;
	overflow: auto;
`;

const StyledPageTitle = styled(PageTitle)`
	text-transform: uppercase;
`;

const mapStateToProps = state => ({
	currentWallet: getCurrentWallet(state),
	debtStatus: getDebtStatusData(state),
});

export default connect(mapStateToProps, null)(Withdrawals);
