import snxJSConnector from '../../helpers/snxJSConnector';

import { bigNumberFormatter } from '../../helpers/formatters';

const getEscrow = async walletAddress => {
	try {
		const results = await Promise.all([
			snxJSConnector.snxJS.RewardEscrow.totalEscrowedAccountBalance(walletAddress),
			snxJSConnector.snxJS.SynthetixEscrow.balanceOf(walletAddress),
		]);
		const [reward, tokenSale] = results.map(bigNumberFormatter);
		return {
			reward,
			tokenSale,
		};
	} catch (e) {
		console.log(e);
	}
};

export const fetchData = async walletAddress => {
	const [escrowData] = await Promise.all([getEscrow(walletAddress)]).catch(e => console.log(e));
	console.log(escrowData);
	return {
		escrowData,
	};
};
