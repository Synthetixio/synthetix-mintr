import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import BarChart from '../../components/BarChart';
import { H6 } from '../../components/Typography';
import Box, { BoxInner, BoxHeading } from './Box';

import { getWalletBalances } from '../../ducks/balances';
import { formatCurrency } from '../../helpers/formatters';
import { CRYPTO_CURRENCY_TO_KEY } from '../../constants/currency';

const Charts = ({ walletBalances, debtData, escrowData }) => {
	const { t } = useTranslation();
	const snxBalance = walletBalances[CRYPTO_CURRENCY_TO_KEY.SNX];
	const snxLocked =
		snxBalance &&
		debtData &&
		debtData.currentCRatio &&
		debtData.targetCRatio &&
		snxBalance * Math.min(1, debtData.currentCRatio / debtData.targetCRatio);

	const totalEscrow = escrowData.reward + escrowData.tokenSale;
	const transferable = debtData ? debtData.transferable : 0;

	const chartData = [
		[
			{
				label: t('dashboard.holdings.locked'),
				value: snxBalance - transferable,
			},
			{
				label: t('dashboard.holdings.transferable'),
				value: transferable,
			},
		],
		[
			{
				label: t('dashboard.holdings.staking'),
				value: snxLocked,
			},
			{
				label: t('dashboard.holdings.nonStaking'),
				value: snxBalance - snxLocked,
			},
		],
		[
			{
				label: t('dashboard.holdings.escrowed'),
				value: totalEscrow,
			},
			{
				label: t('dashboard.holdings.nonEscrowed'),
				value: snxBalance - totalEscrow,
			},
		],
	];

	return (
		<Box full={true}>
			<BoxInner>
				<BoxHeading>
					<H6 style={{ textTransform: 'uppercase' }}>{t('dashboard.holdings.title')}</H6>
					<H6>{formatCurrency(snxBalance) || 0} SNX</H6>
				</BoxHeading>
				{chartData.map((data, i) => {
					return <BarChart key={i} data={data} />;
				})}
			</BoxInner>
		</Box>
	);
};

const mapStateToProps = state => ({
	walletBalances: getWalletBalances(state),
});

export default connect(mapStateToProps, null)(Charts);
