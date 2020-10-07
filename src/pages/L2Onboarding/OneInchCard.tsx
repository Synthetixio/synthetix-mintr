import ErrorMessage from 'components/ErrorMessage';
import Input from './components/Input';
import { CTAButton } from 'components/L2Onboarding/component/CTAButton';
import { CRYPTO_CURRENCY_TO_KEY } from 'constants/currency';
import { getWalletBalances } from 'ducks/balances';
import { DebtStatus, getDebtStatusData } from 'ducks/debtStatus';
import { GasPrice, getCurrentGasPrice } from 'ducks/network';
import { getRates, Rates } from 'ducks/rates';
import { utils } from 'ethers';
import { addBufferToGasLimit } from 'helpers/networkHelper';
import { formatCurrency } from 'helpers/formatters';
import snxJSConnector from 'helpers/snxJSConnector';
import useOneInch, { ethTokenAddress, sUSDTokenAddress } from 'hooks/useOneInch';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import GasIndicator from 'components/L2Onboarding/GasIndicator';

export const OneInchCard = ({
	rates,
	debtStatus,
	walletBalances = { crypto: { sUSD: 0, ETH: 0 } },
	currentGasPrice,
}: {
	rates: Rates;
	debtStatus: DebtStatus;
	walletBalances: any;
	currentGasPrice: GasPrice;
}) => {
	const baseCurrencyKey = CRYPTO_CURRENCY_TO_KEY.ETH;
	const quoteCurrencyKey = CRYPTO_CURRENCY_TO_KEY.sUSD;

	const { signer } = snxJSConnector;
	const { swap, oneInchContract } = useOneInch(signer);

	const {
		crypto: { ETH: ethBalance },
	} = walletBalances;

	const amountToBuy = debtStatus.debtBalance - walletBalances.crypto[baseCurrencyKey];

	const [baseCurrencyAmount, setBaseCurrencyAmount] = useState<number>(
		amountToBuy / rates[baseCurrencyKey]
	);
	const [quoteCurrencyAmount, setQuoteCurrencyAmount] = useState<number>(amountToBuy);
	const [error, setError] = useState<string | null>(null);
	const [isFetchingGasLimit, setIsFetchingGasLimit] = useState<boolean>(false);
	const [gasLimit, setGasLimit] = useState<number | null>(null);

	useEffect(() => {
		const getGasEstimate = async () => {
			if (!oneInchContract || !baseCurrencyAmount) return;
			setError(null);
			try {
				setIsFetchingGasLimit(true);

				const amountBN = utils.parseEther(baseCurrencyAmount.toString());
				const swapRates = await oneInchContract.getExpectedReturn(
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
					0,
					{ value: amountBN }
				);

				setIsFetchingGasLimit(false);
				setGasLimit(addBufferToGasLimit(gasEstimate));
			} catch (e) {
				setIsFetchingGasLimit(false);
				const errorMessage = (e && e.message) || 'Error while getting gas estimate';
				setError(errorMessage);
			}
		};
		getGasEstimate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [oneInchContract, baseCurrencyAmount]);

	return (
		<FormContainer>
			<Balance>{`Balance: ${formatCurrency(ethBalance, 4)} ETH`}</Balance>
			<Input
				onMax={() => null}
				currency={baseCurrencyKey}
				onChange={(e: any) => {
					const value = Number(e.target.value);

					setBaseCurrencyAmount(value);
					setQuoteCurrencyAmount(value * rates[baseCurrencyKey]);
				}}
				value={baseCurrencyAmount}
			/>
			<Input
				onMax={() => null}
				currency={quoteCurrencyKey}
				onChange={(e: any) => {
					const value = Number(e.target.value);

					setQuoteCurrencyAmount(value);
					setBaseCurrencyAmount(value / rates[baseCurrencyKey]);
				}}
				value={quoteCurrencyAmount}
			/>

			<GasIndicator isFetchingGasLimit={isFetchingGasLimit} gasLimit={gasLimit} />
			<StyledCTAButton
				disabled={!gasLimit || error}
				onClick={async () =>
					swap(baseCurrencyAmount.toString(), currentGasPrice.formattedPrice, gasLimit)
				}
			>
				Buy Now
			</StyledCTAButton>
			{error && <ErrorMessage message={error} />}
		</FormContainer>
	);
};

const FormContainer = styled.div`
	width: 480px;
	margin: 0px 0px 10px 0px;
`;

const Balance = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-bottom: 12px;
	letter-spacing: 0.2px;
	color: #9492c4;
`;

const StyledCTAButton = styled(CTAButton)`
	width: 100%;
`;

const mapStateToProps = (state: any) => ({
	rates: getRates(state),
	debtStatus: getDebtStatusData(state),
	walletBalances: getWalletBalances(state),
	currentGasPrice: getCurrentGasPrice(state),
});

export default connect(mapStateToProps)(OneInchCard);
