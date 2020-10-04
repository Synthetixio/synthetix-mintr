import ErrorMessage from 'components/ErrorMessage';
import Input from 'components/Input';
import { CTAButton } from 'components/L2Onboarding/component/CTAButton';
import TransactionPriceIndicator from 'components/TransactionPriceIndicator';
import { CRYPTO_CURRENCY_TO_KEY } from 'constants/currency';
import { GWEI_UNIT } from 'constants/network';
import { getAppIsReady } from 'ducks/app';
import { getWalletBalances } from 'ducks/balances';
import { DebtStatus, getDebtStatusData } from 'ducks/debtStatus';
import { getRates, Rates } from 'ducks/rates';
import { utils } from 'ethers';
import { addBufferToGasLimit } from 'helpers/networkHelper';
import snxJSConnector from 'helpers/snxJSConnector';
import useOneInch, { ethTokenAddress, sUSDTokenAddress } from 'hooks/useOneInch';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import COLORS from 'styles/colors';

export const OneInchCard = ({
	appIsReady,
	rates,
	debtStatus,
	walletBalances = { crypto: { sUSD: 0 } },
}: {
	appIsReady: boolean;
	rates: Rates;
	debtStatus: DebtStatus;
	walletBalances: any;
}) => {
	const quoteCurrencyKey = CRYPTO_CURRENCY_TO_KEY.ETH;
	const baseCurrencyKey = CRYPTO_CURRENCY_TO_KEY.sUSD;
	const [isFetchingGasLimit, setFetchingGasLimit] = useState(false);
	const [gasLimit, setGasLimit] = useState(0);
	const { swap, oneInchContract } = useOneInch(
		appIsReady,
		snxJSConnector.snxJS.contractSettings.signer
	);
	const amountToBuy = debtStatus.debtBalance - walletBalances.crypto[baseCurrencyKey];

	const gasEstimateError = useGetGasEstimate(
		setFetchingGasLimit,
		setGasLimit,
		oneInchContract,
		amountToBuy
	);

	const [quoteCurrencyAmount, setQuoteCurrencyAmount] = useState<string>(
		`${amountToBuy / rates[quoteCurrencyKey]}`
	);
	const [baseCurrencyAmount, setBaseCurrencyAmount] = useState<string>(`${amountToBuy}`);

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
				<WhiteText>{`ETH: ${quoteCurrencyAmount}`}</WhiteText>
				<br />
				<TransactionPriceIndicator isFetchingGasLimit={isFetchingGasLimit} gasLimit={gasLimit} />
				<CTAButton onClick={() => swap(quoteCurrencyAmount, gasLimit * GWEI_UNIT)}>
					Buy Now
				</CTAButton>
				{!!gasEstimateError && <ErrorMessage message={gasEstimateError} />}
			</Form>
		</>
	);
};

const useGetGasEstimate = (setFetchingGasLimit, setGasLimit, oneInchContract, amount) => {
	const [error, setError] = useState(null);
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
					100,
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
				setGasLimit(addBufferToGasLimit(gasEstimate));
			} catch (e) {
				setFetchingGasLimit(false);
				console.log(e);
				const errorMessage = (e && e.message) || 'Error while getting gas estimate';
				setError(errorMessage);
			}
		};
		getGasEstimate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [oneInchContract, amount]);
	return error;
};

const Form = styled.div`
	width: 400px;
	margin: 0px 0px 10px 0px;
`;

const WhiteText = styled.div`
	color: ${COLORS.white};
`;

const mapStateToProps = (state: any) => ({
	rates: getRates(state),
	appIsReady: getAppIsReady(state),
	debtStatus: getDebtStatusData(state),
	walletBalances: getWalletBalances(state),
});

export default connect(mapStateToProps)(OneInchCard);
