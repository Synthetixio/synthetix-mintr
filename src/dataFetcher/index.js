import snxJSConnector from 'helpers/snxJSConnector';
import { bigNumberFormatter, bytesFormatter } from 'helpers/formatters';

export const getDebtStatus = async walletAddress => {
	const {
		snxJS: { SynthetixState, Synthetix },
	} = snxJSConnector;
	const result = await Promise.all([
		SynthetixState.issuanceRatio(),
		Synthetix.collateralisationRatio(walletAddress),
		Synthetix.transferableSynthetix(walletAddress),
		Synthetix.debtBalanceOf(walletAddress, bytesFormatter('sUSD')),
	]);
	const [targetCRatio, currentCRatio, transferable, debtBalance] = result.map(bigNumberFormatter);
	return {
		targetCRatio,
		currentCRatio,
		transferable,
		debtBalance,
	};
};

export const getEscrowData = async walletAddress => {
	const {
		snxJS: { RewardEscrow, SynthetixEscrow },
	} = snxJSConnector;
	const results = await Promise.all([
		RewardEscrow.totalEscrowedAccountBalance(walletAddress),
		SynthetixEscrow.balanceOf(walletAddress),
	]);
	const [stakingRewards, tokenSale] = results.map(bigNumberFormatter);
	return {
		stakingRewards,
		tokenSale,
	};
};
