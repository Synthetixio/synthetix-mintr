import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { intervalToDuration } from 'date-fns';

import { getCurrentWallet } from 'ducks/wallet';

import PageContainer from 'components/PageContainer';
import { PageTitle, PLarge } from 'components/Typography';
import { TABLE_PALETTE } from 'components/Table/constants';
import Table from 'components/Table';
import snxJSConnector from 'helpers/snxJSConnector';
import useInterval from 'hooks/useInterval';
import { MicroSpinner } from 'components/Spinner';
import { FlexDivCentered } from 'styles/common';
import { formatCurrency } from 'helpers/formatters';

const NUM_BLOCKS_TO_FETCH = 10000000;
const INTERVAL_TIMER = 60 * 1000;
const FRAUD_PROOF_WINDOW = 60 * 1000;

const getCounddown = durationObject => {
	const { days, hours, minutes } = durationObject;
	if (days) {
		return `${days} days ${minutes} minutes`;
	} else if (hours) {
		return `${hours} hours ${minutes} minutes`;
	} else if (minutes) {
		return `${minutes} minute(s)`;
	} else return 'less than a minute';
};

const Withdrawals = ({ currentWallet }) => {
	const [submittedWithdrawals, setSubmittedWithdrawals] = useState(null);
	const [isFetchingSubmittedWithdrawals, setIsFetchingSubmittedWithdrawals] = useState(false);

	const fetchSubmittedWithdrawals = async () => {
		const {
			provider,
			snxJS: { SynthetixBridgeToBase },
		} = snxJSConnector;
		const { hexZeroPad, id } = ethers.utils;

		try {
			setIsFetchingSubmittedWithdrawals(true);
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
						isOld: timestamp + FRAUD_PROOF_WINDOW < Date.now(),
						remaining: getCounddown(
							intervalToDuration({
								start: new Date(timestamp + FRAUD_PROOF_WINDOW),
								end: new Date(),
							})
						),
						transactionHash: l.transactionHash,
						amount: amount / 1e18,
					};
				})
			);
			setSubmittedWithdrawals(events.filter(e => !e.isOld));
			setIsFetchingSubmittedWithdrawals(false);
		} catch (e) {
			console.log(e);
			setSubmittedWithdrawals(null);
			setIsFetchingSubmittedWithdrawals(false);
		}
	};

	useEffect(() => {
		if (currentWallet) {
			fetchSubmittedWithdrawals();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet]);

	useInterval(() => {
		if (currentWallet) {
			fetchSubmittedWithdrawals();
		}
	}, INTERVAL_TIMER);

	return (
		<PageContainer>
			<StyledPageTitle>Submitted</StyledPageTitle>
			<PLarge>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Velit integer commodo volutpat
				risus id nam tellus fames bibendum. Pharetra id nec sed justo ut. Praesent amet non pulvinar
				pellentesque elementum, sit.
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
								Header: 'verify',
								accessor: 'transactionHash',
								Cell: ({ value }) => {
									return 'value';
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
			<StyledPageTitle>Pending</StyledPageTitle>
			<PLarge>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Velit integer commodo volutpat
				risus id nam tellus fames bibendum. Pharetra id nec sed justo ut. Praesent amet non pulvinar
				pellentesque elementum, sit.
			</PLarge>
			<TableWrapper>
				<Table
					data={[
						{ balance: 100 },
						{ balance: 100 },
						{ balance: 100 },
						{ balance: 100 },
						{ balance: 100 },
						{ balance: 100 },
						{ balance: 100 },
						{ balance: 100 },
						{ balance: 100 },
						{ balance: 100 },
						{ balance: 100 },
						{ balance: 100 },
						{ balance: 100 },
						{ balance: 100 },
						{ balance: 100 },
						{ balance: 100 },
						{ balance: 100 },
						{ balance: 100 },
						{ balance: 100 },
						{ balance: 100 },
					]}
					palette={TABLE_PALETTE.STRIPED}
					columns={[
						{
							Header: 'amount',
							accessor: 'balance',
							Cell: ({ value }) => {
								return 100;
							},
							sortable: false,
						},
						{
							Header: 'remaining',
							accessor: 'remaining',
							Cell: ({ value }) => {
								return 100;
							},
							sortable: false,
						},
						{
							Header: 'verify',
							accessor: 'hash',
							Cell: ({ value }) => {
								return 100;
							},
							sortable: false,
						},
					]}
				/>
			</TableWrapper>
		</PageContainer>
	);
};

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
});

export default connect(mapStateToProps, null)(Withdrawals);
