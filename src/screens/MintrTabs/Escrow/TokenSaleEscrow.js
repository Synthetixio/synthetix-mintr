import React, { Fragment, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { withTranslation, useTranslation } from 'react-i18next';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { Store } from '../../../store';
import { formatCurrency, bigNumberFormatter } from '../../../helpers/formatters';

import { TableHeader, TableWrapper, Table, TBody, TR, TD } from '../../../components/ScheduleTable';
import {
	PageTitle,
	PLarge,
	H5,
	DataLarge,
	TableHeaderMedium,
	DataHeaderLarge,
	DataMega,
} from '../../../components/Typography';
import Spinner from '../../../components/Spinner';
import { ButtonPrimary, ButtonSecondary } from '../../../components/Button';

import { updateGasLimit, fetchingGasLimit } from '../../../ducks/network';
import ErrorMessage from '../../../components/ErrorMessage';
import EscrowActions from '../../EscrowActions';
import TransactionPriceIndicator from '../../../components/TransactionPriceIndicator';

const mapVestingData = data => {
	const currentUnixTime = new Date().getTime();
	const vestStartTime = 1520899200;
	const monthInSeconds = 2592000;
	const dataReversed = data.slice().reverse();
	let totalPeriod = 0;
	let hasVesting = false;
	let lastVestTime;
	let groupedData = [];
	let availableTokensForVesting = 0;
	let totalVesting;

	for (let i = 0; i < dataReversed.length - 1; i += 2) {
		const parsedQuantity = bigNumberFormatter(dataReversed[i], 3);
		const parsedDate = parseInt(dataReversed[i + 1]) * 1000;
		if (parsedDate !== 0) {
			hasVesting = true;
			totalPeriod++;
		}

		if (parsedDate === 0 && hasVesting) {
			totalPeriod++;
		}

		if (parsedDate !== 0 && !lastVestTime) {
			lastVestTime = dataReversed[i + 1];
		}

		if (parsedDate > 0 && parsedDate < currentUnixTime) {
			availableTokensForVesting += parsedQuantity;
		}

		if (lastVestTime) {
			totalVesting = totalVesting ? totalVesting.add(dataReversed[i]) : dataReversed[i];
			groupedData.push({ time: parsedDate, value: parsedQuantity });
		}
	}

	const escrowPeriod = parseInt((lastVestTime - vestStartTime) / monthInSeconds);
	const releaseIntervalMonths = escrowPeriod / totalPeriod;
	return hasVesting
		? {
				escrowPeriod,
				releaseIntervalMonths,
				totalPeriod,
				availableTokensForVesting,
				data: groupedData,
				totalVesting: bigNumberFormatter(totalVesting),
		  }
		: null;
};

const useGetGasEstimateError = () => {
	const { dispatch } = useContext(Store);
	const [error, setError] = useState(null);
	useEffect(() => {
		const getGasEstimate = async () => {
			setError(null);
			fetchingGasLimit(dispatch);
			let gasEstimate;
			try {
				gasEstimate = await snxJSConnector.snxJS.SynthetixEscrow.contract.estimate.vest();
			} catch (e) {
				console.log(e);
				const errorMessage = (e && e.message) || 'error.type.gasEstimate';
				setError(errorMessage);
			}
			updateGasLimit(Number(gasEstimate), dispatch);
		};
		getGasEstimate();
	}, []);
	return error;
};

const useGetVestingData = walletAddress => {
	const [data, setData] = useState({});
	useEffect(() => {
		const getVestingData = async () => {
			try {
				setData({ loading: true });
				const result = await snxJSConnector.snxJS.EscrowChecker.checkAccountSchedule(walletAddress);
				if (result) {
					const vestingData = mapVestingData(result);
					setData({ ...vestingData, loading: false });
				}
			} catch (e) {
				console.log(e);
				setData({ loading: false });
			}
		};
		getVestingData();
	}, [walletAddress]);
	return data;
};

const VestingInfo = ({ state }) => {
	const { t } = useTranslation();
	const { escrowPeriod, releaseIntervalMonths, totalPeriod } = state;
	return (
		<ScheduleWrapper>
			<H5>{t('escrow.tokenSale.table.title')}</H5>
			<TableHeader>
				<TableHeaderMedium>{t('escrow.tokenSale.table.period')}</TableHeaderMedium>
				<TableHeaderMedium>{t('escrow.tokenSale.table.interval')}</TableHeaderMedium>
				<TableHeaderMedium>{t('escrow.tokenSale.table.number')}</TableHeaderMedium>
			</TableHeader>
			<TableWrapper style={{ height: 'auto' }}>
				<Table cellSpacing="0">
					<TBody>
						<TR>
							<TD>
								<DataLarge>
									{escrowPeriod} {t('escrow.tokenSale.table.months')}
								</DataLarge>
							</TD>
							<TD>
								<DataLarge>
									{releaseIntervalMonths} {t('escrow.tokenSale.table.months')}
								</DataLarge>
							</TD>
							<TD>
								<DataLarge>{totalPeriod}</DataLarge>
							</TD>
						</TR>
					</TBody>
				</Table>
			</TableWrapper>
		</ScheduleWrapper>
	);
};

const VestingSchedule = ({ state }) => {
	const { t } = useTranslation();
	const { data, totalVesting } = state;
	const tableContent = data
		? data.map((period, i) => {
				if (period.time === 0) {
					return (
						<TR key={`${i}-${new Date().getTime()}`}>
							<TD>
								<DataLarge>-</DataLarge>
							</TD>
							<TD>
								<DataLarge>{t('escrow.tokenSale.table.vested')}</DataLarge>
							</TD>
						</TR>
					);
				} else {
					return (
						<TR key={`${i}-${new Date().getTime()}`}>
							<TD>
								<DataLarge>{format(period.time, 'dd MMMM yyyy')}</DataLarge>
							</TD>
							<TD>
								<DataLarge>{formatCurrency(period.value)}</DataLarge>
							</TD>
						</TR>
					);
				}
		  })
		: null;
	return (
		<ScheduleWrapper>
			<H5>{t('escrow.tokenSale.table.title')}</H5>
			<TableHeader>
				<TableHeaderMedium>{t('escrow.tokenSale.table.date')}</TableHeaderMedium>
				<TableHeaderMedium>SNX {t('escrow.tokenSale.table.quantity')}</TableHeaderMedium>
			</TableHeader>
			<TableWrapper>
				<Table cellSpacing="0">
					<TBody>{tableContent}</TBody>
				</Table>
			</TableWrapper>
			<RightBlock>
				<DataBlock>
					<DataHeaderLarge style={{ textTransform: 'uppercase' }}>
						{t('escrow.tokenSale.total')}
					</DataHeaderLarge>
					<DataMegaEscrow>{totalVesting ? formatCurrency(totalVesting) : '--'} SNX</DataMegaEscrow>
				</DataBlock>
			</RightBlock>
		</ScheduleWrapper>
	);
};

const TokenSaleEscrow = ({ t, onPageChange }) => {
	const [currentScenario, setCurrentScenario] = useState(null);
	const {
		state: {
			wallet: { currentWallet },
		},
	} = useContext(Store);
	const {
		escrowPeriod,
		releaseIntervalMonths,
		totalPeriod,
		availableTokensForVesting,
		data,
		totalVesting,
		loading,
	} = useGetVestingData(currentWallet);

	const gasEstimateError = useGetGasEstimateError();

	return (
		<Fragment>
			<EscrowActions
				action={currentScenario}
				onDestroy={() => setCurrentScenario(null)}
				vestAmount={availableTokensForVesting}
			/>
			<PageTitle>{t('escrow.tokenSale.title')}</PageTitle>
			<PLarge>{t('escrow.tokenSale.subtitle')}</PLarge>
			{escrowPeriod ? (
				<Fragment>
					<VestingInfo state={{ escrowPeriod, releaseIntervalMonths, totalPeriod }} />
					<VestingSchedule state={{ data, totalVesting }} />
					<TransactionPriceIndicator />
				</Fragment>
			) : (
				<TablePlaceholder>
					{loading ? <Spinner /> : <PLarge>{t('escrow.tokenSale.table.none')}</PLarge>}
				</TablePlaceholder>
			)}
			<ErrorMessage message={gasEstimateError} />
			<ButtonRow>
				<ButtonSecondary width="48%" onClick={() => onPageChange('rewardEscrow')}>
					{t('escrow.buttons.viewRewards')}
				</ButtonSecondary>
				<ButtonPrimary
					disabled={!availableTokensForVesting || gasEstimateError}
					onClick={() => setCurrentScenario('tokenSaleVesting')}
					width="48%"
				>
					{t('escrow.buttons.vest')}
				</ButtonPrimary>
			</ButtonRow>
		</Fragment>
	);
};

const ScheduleWrapper = styled.div`
	width: 100%;
	margin: 50px 0;
`;

const RightBlock = styled.div`
	margin-top: 40px;
	display: flex;
	justify-content: flex-end;
	width: 100%;
`;

const DataBlock = styled.div`
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 2px;
	width: 338px;
	height: 88px;
	padding: 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-direction: column;
`;

const DataMegaEscrow = styled(DataMega)`
	color: ${props => props.theme.colorStyles.escrowNumberBig};
`;

const ButtonRow = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
`;

const TablePlaceholder = styled.div`
	height: 700px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export default withTranslation()(TokenSaleEscrow);
