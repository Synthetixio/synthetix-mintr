import { formatCurrency } from '../../../helpers/formatters';

export function getStakingAmount({ issuanceRatio, mintAmount, SNXPrice }) {
	if (!mintAmount || !issuanceRatio || !SNXPrice) return '0';
	return formatCurrency(mintAmount / issuanceRatio / SNXPrice);
}
