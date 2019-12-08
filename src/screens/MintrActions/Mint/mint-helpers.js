import { formatCurrency } from '../../../helpers/formatters';
import { toNumber, isFinite, isNil } from 'lodash';

export function getStakingAmount({ issuanceRatio, mintAmount, SNXPrice }) {
	if (!mintAmount || !issuanceRatio || !SNXPrice) return '0';
	return formatCurrency(mintAmount / issuanceRatio / SNXPrice);
}

export function estimateCRatio({ SNXPrice, debtBalance, snxBalance, mintAmount }) {
	if (isNil(SNXPrice) || isNil(debtBalance) || isNil(snxBalance)) {
		return 0;
	}

	const parsedMintAmount = toNumber(mintAmount);
	const mintAmountNumber = isFinite(parsedMintAmount) ? parsedMintAmount : 0;
	const snxValue = snxBalance * SNXPrice;
	return Math.round((snxValue / (debtBalance + mintAmountNumber)) * 100);
}
