import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import snxJSConnector from 'helpers/snxJSConnector';
import { addBufferToGasLimit } from 'helpers/networkHelper';

export const useGetGasEstimate = (
	burnAmount,
	maxBurnAmount,
	maxBurnAmountBN,
	sUSDBalance,
	waitingPeriod,
	issuanceDelay,
	setFetchingGasLimit,
	setGasLimit
) => {
	const [error, setError] = useState(null);
	const { t } = useTranslation();
	useEffect(() => {
		if (!burnAmount) return;
		const getGasEstimate = async () => {
			setError(null);
			let gasEstimate;
			try {
				if (!parseFloat(burnAmount)) throw new Error('input.error.invalidAmount');
				if (waitingPeriod) throw new Error('Waiting period for sUSD is still ongoing');
				if (issuanceDelay) throw new Error('Waiting period to burn is still ongoing');
				if (burnAmount > sUSDBalance || maxBurnAmount === 0)
					throw new Error('input.error.notEnoughToBurn');
				setFetchingGasLimit(true);

				let amountToBurn;
				if (burnAmount && maxBurnAmount) {
					amountToBurn =
						burnAmount === maxBurnAmount
							? maxBurnAmountBN
							: snxJSConnector.utils.parseEther(burnAmount.toString());
				} else amountToBurn = 0;
				gasEstimate = await snxJSConnector.snxJS.Synthetix.contract.estimate.burnSynths(
					amountToBurn
				);
				setGasLimit(addBufferToGasLimit(gasEstimate));
			} catch (e) {
				console.log(e);
				const errorMessage = (e && e.message) || 'input.error.gasEstimate';
				setError(t(errorMessage));
			}
			setFetchingGasLimit(false);
		};
		getGasEstimate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [burnAmount, maxBurnAmount, waitingPeriod, issuanceDelay]);
	return error;
};
