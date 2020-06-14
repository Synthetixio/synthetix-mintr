import axios from 'axios';
import snxJSConnector from 'helpers/snxJSConnector';

import { CRYPTO_CURRENCY_TO_KEY } from 'constants/currency';
import { bigNumberFormatter, bytesFormatter, parseBytes32String } from 'helpers/formatters';

export const getDebtStatus = async (walletAddress: string) => {
	const {
		// @ts-ignore
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

export const getEscrowData = async (walletAddress: string) => {
	const {
		// @ts-ignore
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

const fetchUniswapSETHRate = async () => {
	const {
		// @ts-ignore
		snxJS: { sETH },
	} = snxJSConnector;
	const DEFAULT_RATE = 1;

	try {
		const sETHAddress = sETH.contract.address;
		const query = `query {
			exchanges(where: {tokenAddress:"${sETHAddress}"}) {
				price
			}
		}`;

		const response = await axios.post(
			'https://api.thegraph.com/subgraphs/name/graphprotocol/uniswap',
			JSON.stringify({ query, variables: null })
		);

		return (
			(response.data &&
				response.data.data &&
				response.data.data.exchanges &&
				response.data.data.exchanges[0] &&
				1 / response.data.data.exchanges[0].price) ||
			DEFAULT_RATE
		);
	} catch (e) {
		// if we can't get the sETH/ETH rate, then default it to 1:1
		return DEFAULT_RATE;
	}
};

export const getExchangeRates = async () => {
	const {
		// @ts-ignore
		synthSummaryUtilContract,
		// @ts-ignore
		snxJS: { ExchangeRates },
	} = snxJSConnector;

	const [synthsRates, snxRate, uniswapSETHRate] = await Promise.all([
		synthSummaryUtilContract.synthsRates(),
		ExchangeRates.rateForCurrency(bytesFormatter(CRYPTO_CURRENCY_TO_KEY.SNX)),
		fetchUniswapSETHRate(),
	]);

	let exchangeRates = {
		[CRYPTO_CURRENCY_TO_KEY.SNX]: snxRate / 1e18,
	};
	const [keys, rates] = synthsRates;
	keys.forEach((key: string, i: number) => {
		const synthName = parseBytes32String(key);
		const rate = rates[i] / 1e18;
		if (synthName === CRYPTO_CURRENCY_TO_KEY.sUSD) {
			exchangeRates[CRYPTO_CURRENCY_TO_KEY.sUSD] = uniswapSETHRate;
		} else if (synthName === CRYPTO_CURRENCY_TO_KEY.sETH) {
			exchangeRates[CRYPTO_CURRENCY_TO_KEY.sETH] = rate;
			exchangeRates[CRYPTO_CURRENCY_TO_KEY.ETH] = rate;
		} else {
			exchangeRates[synthName] = rate;
		}
	});
	return exchangeRates;
};
