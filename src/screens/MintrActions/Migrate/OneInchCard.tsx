import ErrorMessage from 'components/ErrorMessage';
import Input from 'components/Input';
import { CTAButton } from 'components/L2Onboarding/component/CTAButton';
import TransactionPriceIndicator from 'components/TransactionPriceIndicator';
import { CRYPTO_CURRENCY_TO_KEY } from 'constants/currency';
import { getAppIsReady } from 'ducks/app';
import { getWalletBalances } from 'ducks/balances';
import { DebtStatus, getDebtStatusData } from 'ducks/debtStatus';
import { GasPrice, getCurrentGasPrice } from 'ducks/network';
import { getRates, Rates } from 'ducks/rates';
import { utils } from 'ethers';
import { addBufferToGasLimit } from 'helpers/networkHelper';
import snxJSConnector from 'helpers/snxJSConnector';
import useOneInch, { ethTokenAddress, sUSDTokenAddress } from 'hooks/useOneInch';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

export const OneInchCard = ({
	appIsReady,
	rates,
	debtStatus,
	walletBalances = { crypto: { sUSD: 0 } },
	currentGasPrice,
}: {
	appIsReady: boolean;
	rates: Rates;
	debtStatus: DebtStatus;
	walletBalances: any;
	currentGasPrice: GasPrice;
}) => {
	const quoteCurrencyKey = CRYPTO_CURRENCY_TO_KEY.ETH;
	const baseCurrencyKey = CRYPTO_CURRENCY_TO_KEY.sUSD;
	const { signer } = snxJSConnector;
	const { swap, oneInchContract } = useOneInch(appIsReady, signer);

	const amountToBuy = debtStatus.debtBalance - walletBalances.crypto[baseCurrencyKey];
	const [quoteCurrencyAmount, setQuoteCurrencyAmount] = useState<string>(
		`${amountToBuy / rates[quoteCurrencyKey]}`
	);
	const [baseCurrencyAmount, setBaseCurrencyAmount] = useState<string>(`${amountToBuy}`);

	const { gasEstimate, isFetchingGasLimit, error: gasEstimateError } = useGetGasEstimate(
		oneInchContract,
		baseCurrencyAmount
	);

	return (
		<>
			<Form>
				<Input
					singleSynth={baseCurrencyKey}
					onChange={(e: any) => {
						const value = e.target.value;
						const numValue = Number(value);

						setBaseCurrencyAmount(`${numValue}`);
						setQuoteCurrencyAmount(`${numValue / rates[quoteCurrencyKey]}`);
					}}
					value={baseCurrencyAmount}
					placeholder="0.00"
				/>
				<div>{`ETH: ${quoteCurrencyAmount}`}</div>
				<br />
				<TransactionPriceIndicator isFetchingGasLimit={isFetchingGasLimit} gasLimit={gasEstimate} />
				<CTAButton
					onClick={async () => {
						try {
							const tx = await swap(quoteCurrencyAmount, currentGasPrice.price);
							if (tx) {
								console.log(tx);
							}
						} catch (e) {
							console.error(e);
						}
					}}
				>
					Buy Now
				</CTAButton>
				{!!gasEstimateError && <ErrorMessage message={gasEstimateError} />}
			</Form>
		</>
	);
};

const useGetGasEstimate = (oneInchContract, amount) => {
	const [error, setError] = useState(null);
	const [isFetchingGasLimit, setFetchingGasLimit] = useState(false);
	const [gasEstimate, setGasEstimate] = useState(1);
	useEffect(() => {
		if (oneInchContract === null) {
			return () => {};
		}
		const getGasEstimate = async () => {
			setError(null);
			try {
				setFetchingGasLimit(true);
				const amountBN = utils.parseEther(`${amount}`);
				const swapRates = await oneInchContract.functions.getExpectedReturn(
					ethTokenAddress,
					sUSDTokenAddress,
					amountBN,
					5,
					0
				);
				const gasEstimate = await oneInchContract.estimate.swap(
					ethTokenAddress,
					sUSDTokenAddress,
					amountBN,
					swapRates.returnAmount,
					swapRates.distribution,
					0
				);
				setFetchingGasLimit(false);
				setGasEstimate(addBufferToGasLimit(gasEstimate));
			} catch (e) {
				setFetchingGasLimit(false);
				const errorMessage = (e && e.message) || 'Error while getting gas estimate';
				setError(errorMessage);
			}
		};
		getGasEstimate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [oneInchContract, amount]);
	return { gasEstimate, isFetchingGasLimit, error };
};

const Form = styled.div`
	width: 400px;
	margin: 0px 0px 10px 0px;
`;

const mapStateToProps = (state: any) => ({
	rates: getRates(state),
	appIsReady: getAppIsReady(state),
	debtStatus: getDebtStatusData(state),
	walletBalances: getWalletBalances(state),
	currentGasPrice: getCurrentGasPrice(state),
});

export default connect(mapStateToProps)(OneInchCard);
