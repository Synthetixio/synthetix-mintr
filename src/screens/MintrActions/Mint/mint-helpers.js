import { formatCurrency } from '../../../helpers/formatters';

export function getStakingAmount({ issuanceRatio, mintAmount, SNXPrice }) {
	if (!mintAmount || !issuanceRatio || !SNXPrice) return '0';
	return formatCurrency(mintAmount / issuanceRatio / SNXPrice);
}

export function estimateCRatio({ SNXPrice, debtBalance, snxBalance, mintAmount = 0 }) {
	const mintAmountNumber = mintAmount === '' ? 0 : parseFloat(mintAmount);
	const snxValue = snxBalance * SNXPrice;
	return Math.round((snxValue / (debtBalance + mintAmountNumber)) * 100);
}
