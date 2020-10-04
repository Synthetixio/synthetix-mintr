import { useEffect, useState } from 'react';
import { Contract, Signer, utils } from 'ethers';

import oneSplitAuditContract from 'helpers/contracts/oneinch/oneSplitAuditContract';
import { SUPPORTED_NETWORKS_MAP } from 'helpers/networkHelper';
import { Provider } from 'ethers/providers';
import { GWEI_UNIT } from 'constants/network';

export const sUSDTokenAddress = '0x57ab1ec28d129707052df4df418d58a2d46d5f51';
export const ethTokenAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

const useOneInch = (isAppReady: boolean, signer: Signer | Provider) => {
	const [oneInchContract, setOneInchContract] = useState<Contract | null>(null);

	useEffect(() => {
		if (isAppReady && signer) {
			const contract = new Contract(
				oneSplitAuditContract.addresses[SUPPORTED_NETWORKS_MAP.MAINNET],
				oneSplitAuditContract.abi,
				signer
			);
			setOneInchContract(contract);
		}
	}, [isAppReady, signer]);

	const swap = async (amount: string, gasPrice: number) => {
		try {
			if (oneInchContract != null) {
				const amountBN = utils.parseEther(amount);
				const swapRates = await oneInchContract.functions.getExpectedReturn(
					ethTokenAddress,
					sUSDTokenAddress,
					amountBN,
					5,
					0
				);

				const swapParams = [
					ethTokenAddress,
					sUSDTokenAddress,
					amountBN,
					swapRates.returnAmount,
					swapRates.distribution,
					0,
				];

				return oneInchContract.functions.swap(...swapParams, {
					gasPrice: gasPrice * GWEI_UNIT,
				});
			}
		} catch (e) {
			return Promise.reject(e);
		}
	};

	return {
		swap,
		oneInchContract,
	};
};

export default useOneInch;
