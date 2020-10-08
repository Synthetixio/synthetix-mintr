import snxJSConnector from 'helpers/snxJSConnector';

import { CRYPTO_CURRENCY_TO_KEY } from 'constants/currency';
import { bigNumberFormatter, bytesFormatter, parseBytes32String } from 'helpers/formatters';

const DEFAULT_SUSD_RATE = 1;

export const getDebtStatus = async (walletAddress: string) => {
	const {
		snxJS: { SystemSettings, Synthetix, SynthetixEscrow, RewardEscrow, ExchangeRates },
	} = snxJSConnector as any;
	const debtBalanceBN = await Synthetix.debtBalanceOf(walletAddress, bytesFormatter('sUSD'));
	const SNXBytes = bytesFormatter('SNX');

	console.log(snxJSConnector);

	const result = await Promise.all([
		SystemSettings.issuanceRatio(),
		Synthetix.collateralisationRatio(walletAddress),
		Synthetix.transferableSynthetix(walletAddress),
		Synthetix.debtBalanceOf(walletAddress, bytesFormatter('sUSD')),
		ExchangeRates.rateForCurrency(SNXBytes),
		RewardEscrow.totalEscrowedAccountBalance(walletAddress),
		SynthetixEscrow.balanceOf(walletAddress),
		Synthetix.maxIssuableSynths(walletAddress),
	]);

	const [
		targetCRatio,
		currentCRatio,
		transferable,
		debtBalance,
		SNXPrice,
		totalRewardEscrow,
		totalTokenSaleEscrow,
		issuableSynths,
	] = result.map(bigNumberFormatter);
	const escrowBalance = totalRewardEscrow + totalTokenSaleEscrow;
	return {
		targetCRatio,
		currentCRatio,
		transferable,
		debtBalance,
		SNXPrice,
		debtEscrow: Math.max(escrowBalance * SNXPrice * targetCRatio + debtBalance - issuableSynths, 0),
		debtBalanceBN,
	};
};

export const getEscrowData = async (walletAddress: string) => {
	const {
		snxJS: { RewardEscrow, SynthetixEscrow },
	} = snxJSConnector as any;
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

const fetchCurveSUSDRate = async () => {
	const { curveSUSDSwapContract, utils } = snxJSConnector as any;
	const usdcContractNumber = 1;
	const susdContractNumber = 3;
	const susdAmount = 10000;

	try {
		const unformattedExchangeAmount = await curveSUSDSwapContract.get_dy_underlying(
			susdContractNumber,
			usdcContractNumber,
			utils.parseEther(susdAmount.toString())
		);
		return unformattedExchangeAmount
			? unformattedExchangeAmount / 1e6 / susdAmount
			: DEFAULT_SUSD_RATE;
	} catch (e) {
		// if we can't get the sUSD rate from Curve, then default it to 1:1
		return DEFAULT_SUSD_RATE;
	}
};

export const getExchangeRates = async () => {
	const {
		synthSummaryUtilContract,
		snxJS: { ExchangeRates },
	} = snxJSConnector as any;

	const [synthsRates, snxRate, curveSUSDRate] = await Promise.all([
		synthSummaryUtilContract.synthsRates(),
		ExchangeRates.rateForCurrency(bytesFormatter(CRYPTO_CURRENCY_TO_KEY.SNX)),
		fetchCurveSUSDRate(),
	]);

	let exchangeRates = {
		[CRYPTO_CURRENCY_TO_KEY.SNX]: snxRate / 1e18,
	};
	const [keys, rates] = synthsRates;
	keys.forEach((key: string, i: number) => {
		const synthName = parseBytes32String(key);
		const rate = rates[i] / 1e18;
		if (synthName === CRYPTO_CURRENCY_TO_KEY.sUSD) {
			exchangeRates[CRYPTO_CURRENCY_TO_KEY.sUSD] = curveSUSDRate;
		} else if (synthName === CRYPTO_CURRENCY_TO_KEY.sETH) {
			exchangeRates[CRYPTO_CURRENCY_TO_KEY.sETH] = rate;
			exchangeRates[CRYPTO_CURRENCY_TO_KEY.ETH] = rate;
		} else {
			exchangeRates[synthName] = rate;
		}
	});
	return exchangeRates;
};

export const getBalances = async (walletAddress: string) => {
	const {
		synthSummaryUtilContract,
		snxJS: { Synthetix },
		provider,
	} = snxJSConnector as any;
	const [
		synthBalanceResults,
		totalSynthsBalanceResults,
		snxBalanceResults,
		ethBalanceResults,
	] = await Promise.all([
		synthSummaryUtilContract.synthsBalances(walletAddress),
		synthSummaryUtilContract.totalSynthsInKey(
			walletAddress,
			bytesFormatter(CRYPTO_CURRENCY_TO_KEY.sUSD)
		),
		Synthetix.collateral(walletAddress),
		provider.getBalance(walletAddress),
	]);

	const [synthsKeys, synthsBalances] = synthBalanceResults;

	const synths = synthsKeys
		.map((key: string, i: number) => {
			return {
				name: parseBytes32String(key),
				balance: bigNumberFormatter(synthsBalances[i]),
				balanceBN: synthsBalances[i],
			};
		})
		.filter((synth: any) => synth.balance);

	const sUSDBalance = synths.find((synth: any) => synth.name === CRYPTO_CURRENCY_TO_KEY.sUSD);
	const cryptoToArray = [
		{
			name: CRYPTO_CURRENCY_TO_KEY.SNX,
			balance: bigNumberFormatter(snxBalanceResults),
			balanceBN: snxBalanceResults,
		},
		{
			name: CRYPTO_CURRENCY_TO_KEY.ETH,
			balance: bigNumberFormatter(ethBalanceResults),
			balanceBN: ethBalanceResults,
		},
	];
	const all = synths.concat(cryptoToArray);
	return {
		crypto: {
			[CRYPTO_CURRENCY_TO_KEY.SNX]: bigNumberFormatter(snxBalanceResults),
			[CRYPTO_CURRENCY_TO_KEY.ETH]: bigNumberFormatter(ethBalanceResults),
			[CRYPTO_CURRENCY_TO_KEY.sUSD]: sUSDBalance ? sUSDBalance.balance : 0,
		},
		synths,
		totalSynths: bigNumberFormatter(totalSynthsBalanceResults),
		all,
	};
};
