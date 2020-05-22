import { addSeconds } from 'date-fns';
import snxJSConnector from '../../helpers/snxJSConnector';

import { bytesFormatter, bigNumberFormatter } from '../../helpers/formatters';

const getRewards = async walletAddress => {
	try {
		const [feesAreClaimable, currentFeePeriod, feePeriodDuration] = await Promise.all([
			snxJSConnector.snxJS.FeePool.isFeesClaimable(walletAddress),
			snxJSConnector.snxJS.FeePool.recentFeePeriods(0),
			snxJSConnector.snxJS.FeePool.feePeriodDuration(),
		]);

		const currentPeriodStart =
			currentFeePeriod && currentFeePeriod.startTime
				? new Date(parseInt(currentFeePeriod.startTime * 1000))
				: null;
		const currentPeriodEnd =
			currentPeriodStart && feePeriodDuration
				? addSeconds(currentPeriodStart, feePeriodDuration)
				: null;
		return { feesAreClaimable, currentPeriodEnd };
	} catch (e) {
		console.log(e);
	}
};

const getDebt = async walletAddress => {
	try {
		const result = await Promise.all([
			snxJSConnector.snxJS.SynthetixState.issuanceRatio(),
			snxJSConnector.snxJS.Synthetix.collateralisationRatio(walletAddress),
			snxJSConnector.snxJS.Synthetix.transferableSynthetix(walletAddress),
			snxJSConnector.snxJS.Synthetix.debtBalanceOf(walletAddress, bytesFormatter('sUSD')),
		]);
		const [targetCRatio, currentCRatio, transferable, debtBalance] = result.map(bigNumberFormatter);
		return {
			targetCRatio,
			currentCRatio,
			transferable,
			debtBalance,
		};
	} catch (e) {
		console.log(e);
	}
};

const getEscrow = async walletAddress => {
	try {
		const results = await Promise.all([
			snxJSConnector.snxJS.RewardEscrow.totalEscrowedAccountBalance(walletAddress),
			snxJSConnector.snxJS.SynthetixEscrow.balanceOf(walletAddress),
		]);
		const [reward, tokenSale] = results.map(bigNumberFormatter);
		return {
			reward,
			tokenSale,
		};
	} catch (e) {
		console.log(e);
	}
};

export const fetchData = async walletAddress => {
	const [rewardData, debtData, escrowData] = await Promise.all([
		getRewards(walletAddress),
		getDebt(walletAddress),
		getEscrow(walletAddress),
	]).catch(e => console.log(e));

	return {
		rewardData,
		debtData,
		escrowData,
	};
};
