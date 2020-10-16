import ErrorMessage from 'components/ErrorMessage';
import Input from './components/Input';
import { CTAButton } from 'components/L2Onboarding/component/CTAButton';
import { CRYPTO_CURRENCY_TO_KEY } from 'constants/currency';
import { getWalletBalances } from 'ducks/balances';
import { DebtStatus, getDebtStatusData } from 'ducks/debtStatus';
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
import { GasPrice, getCurrentGasPrice } from 'ducks/network';
import Spinner from 'components/Spinner';
import { getWalletDetails } from 'ducks/wallet';
import { PLarge } from 'components/Typography';
import { useNotifyContext } from 'contexts/NotifyContext';
import { notifyHandler } from 'helpers/notifyHelper';

export const OneInchCard = ({
	rates,
	debtStatus,
	walletBalances = { crypto: { sUSD: 0, ETH: 0 } },
	onComplete,
	currentGasPrice,
	walletDetails,
}: {
	rates: Rates;
	debtStatus: DebtStatus;
	walletBalances: any;
	onComplete: Function;
	currentGasPrice: GasPrice;
	walletDetails: any;
}) => {
	const baseCurrencyKey = CRYPTO_CURRENCY_TO_KEY.ETH;
	const quoteCurrencyKey = CRYPTO_CURRENCY_TO_KEY.sUSD;

	const { signer } = snxJSConnector;
	const { swap, oneInchContract } = useOneInch(signer);
	const { networkId } = walletDetails;
	const {
		crypto: { ETH: ethBalance },
	} = walletBalances;

	const amountToBuy =
		debtStatus.debtBalance && walletBalances.crypto[quoteCurrencyKey]
			? debtStatus.debtBalance - walletBalances.crypto[quoteCurrencyKey]
			: 0;

	const [baseCurrencyAmount, setBaseCurrencyAmount] = useState<string>(
		(amountToBuy / rates[baseCurrencyKey]).toString()
	);

	const [quoteCurrencyAmount, setQuoteCurrencyAmount] = useState<string>(amountToBuy.toString());
	const [error, setError] = useState<string | null>(null);
	const [isFetchingGasLimit, setIsFetchingGasLimit] = useState<boolean>(false);
	const [gasLimit, setGasLimit] = useState<number | null>(null);
	const [isTxPending, setIsTxPending] = useState<boolean>(false);
	const [isCheckingBalance, setIsCheckingBalance] = useState<boolean>(false);

	const { notify } = useNotifyContext();

	const onSwapTransactionConfirmed = () => {
		setIsTxPending(false);
		setIsCheckingBalance(true);
		onComplete();
	};

	useEffect(() => {
		const getGasEstimate = async () => {
			if (!oneInchContract) return;
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
	}, [oneInchContract, baseCurrencyAmount]);

	useEffect(() => {
		setError(null);
		if (baseCurrencyAmount > ethBalance) {
			setError('Insufficient ETH Balance');
		}
	}, [baseCurrencyAmount, ethBalance]);

	return (
		<FormContainer>
			<Balance>{`Balance: ${formatCurrency(ethBalance, 4)} ETH`}</Balance>
			<Input
				onMax={() => {
					setBaseCurrencyAmount(ethBalance.toString());
					setQuoteCurrencyAmount((ethBalance * rates[baseCurrencyKey]).toString());
				}}
				showMax={true}
				currency={baseCurrencyKey}
				onChange={(e: any) => {
					const value = Number(e.target.value);

					setBaseCurrencyAmount(value.toString());
					setQuoteCurrencyAmount((value * rates[baseCurrencyKey]).toString());
				}}
				value={baseCurrencyAmount}
			/>

			<Input
				showMax={false}
				currency={quoteCurrencyKey}
				onChange={(e: any) => {
					const value = Number(e.target.value);

					setQuoteCurrencyAmount(value.toString());
					setBaseCurrencyAmount((value / rates[baseCurrencyKey]).toString());
				}}
				value={quoteCurrencyAmount}
			/>

			<GasIndicator isFetchingGasLimit={isFetchingGasLimit} gasLimit={gasLimit} />
			{isTxPending ? (
				<Spinner />
			) : isCheckingBalance ? (
				<>
					<Spinner />
					<PLarge style={{ textAlign: 'center' }}>Checking Balances...</PLarge>
				</>
			) : (
				<StyledCTAButton
					disabled={!gasLimit || error}
					onClick={async () => {
						try {
							setIsTxPending(true);

							const tx = await swap(
								baseCurrencyAmount.toString(),
								currentGasPrice.formattedPrice,
								gasLimit
							);

							if (notify && tx) {
								const message = 'sUSD swap confirmed';
								notifyHandler(notify, tx.hash, networkId, onSwapTransactionConfirmed, message);
							}
						} catch (e) {
							console.log(e);
							setError(e.message);
							setIsTxPending(false);
							setIsCheckingBalance(false);
						}
					}}
				>
					Buy Now
				</StyledCTAButton>
			)}
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
	walletDetails: getWalletDetails(state),
});

export default connect(mapStateToProps, null)(OneInchCard);
