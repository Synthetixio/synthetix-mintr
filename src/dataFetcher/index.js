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
