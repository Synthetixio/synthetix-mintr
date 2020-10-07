import { useEffect, useState } from 'react';
import { Contract, Signer, utils } from 'ethers';

import oneSplitAuditContract from 'helpers/contracts/oneinch/oneSplitAuditContract';
import { SUPPORTED_NETWORKS_MAP } from 'helpers/networkHelper';
import { Provider } from 'ethers/providers';

export const sUSDTokenAddress = '0x57ab1ec28d129707052df4df418d58a2d46d5f51';
export const ethTokenAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

const useOneInch = (signer: Signer | Provider) => {
	const [oneInchContract, setOneInchContract] = useState<Contract | null>(null);

	useEffect(() => {
		if (signer) {
			const contract = new Contract(
				oneSplitAuditContract.addresses[SUPPORTED_NETWORKS_MAP.MAINNET],
				oneSplitAuditContract.abi,
				signer
			);

			setOneInchContract(contract);
		}
	}, [signer]);

	const swap = async (amount: string, gasPrice: number, gasLimit: number) => {
		try {
			if (oneInchContract != null) {
				const amountBN = utils.parseEther(amount);
				const swapRates = await oneInchContract.getExpectedReturn(
					ethTokenAddress,
					sUSDTokenAddress,
					amountBN,
					100,
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

				return oneInchContract.swap(...swapParams, {
					gasPrice,
					gasLimit,
					value: amountBN,
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
