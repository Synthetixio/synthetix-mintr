import { useState, useEffect } from 'react';
import { bytesFormatter, bigNumberFormatter } from 'helpers/formatters';
import snxJSConnector from 'helpers/snxJSConnector';

export const useGetDebtData = (walletAddress: string, sUSDBytes: string) => {
	const [data, setData] = useState<any>({});
	const SNXBytes = bytesFormatter('SNX');
	useEffect(() => {
		const getDebtData = async () => {
			try {
				const results = await Promise.all([
					snxJSConnector.snxJS.Synthetix.debtBalanceOf(walletAddress, sUSDBytes),
					snxJSConnector.snxJS.sUSD.balanceOf(walletAddress),
					snxJSConnector.snxJS.SynthetixState.issuanceRatio(),
					snxJSConnector.snxJS.ExchangeRates.rateForCurrency(SNXBytes),
					snxJSConnector.snxJS.RewardEscrow.totalEscrowedAccountBalance(walletAddress),
					snxJSConnector.snxJS.SynthetixEscrow.balanceOf(walletAddress),
					snxJSConnector.snxJS.Synthetix.maxIssuableSynths(walletAddress),
				]);
				const [
					debt,
					sUSDBalance,
					issuanceRatio,
					SNXPrice,
					totalRewardEscrow,
					totalTokenSaleEscrow,
					issuableSynths,
				] = results.map(bigNumberFormatter);
				let maxBurnAmount, maxBurnAmountBN;
				if (debt > sUSDBalance) {
					maxBurnAmount = sUSDBalance;
					maxBurnAmountBN = results[1];
				} else {
					maxBurnAmount = debt;
					maxBurnAmountBN = results[0];
				}

				const escrowBalance = totalRewardEscrow + totalTokenSaleEscrow;
				setData({
					issuanceRatio,
					sUSDBalance,
					maxBurnAmount,
					maxBurnAmountBN,
					SNXPrice,
					burnAmountToFixCRatio: Math.max(debt - issuableSynths, 0),
					debtEscrow: Math.max(escrowBalance * SNXPrice * issuanceRatio + debt - issuableSynths, 0),
				});
			} catch (e) {
				console.log(e);
			}
		};
		getDebtData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [walletAddress]);
	return data;
};
