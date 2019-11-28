import { getStakingAmount } from './mint-helpers';

describe('getStakingAmount', () => {
	test('returns 0 when missing issuanceRatio', () => {
		expect(
			getStakingAmount({
				issuanceRatio: 0,
				mintAmount: 100,
				SNXPrice: 100,
			})
		).toBe('0');
	});
	test('returns 0 when missing mintAmount', () => {
		expect(
			getStakingAmount({
				issuanceRatio: 100,
				mintAmount: 200,
				SNXPrice: 0,
			})
		).toBe('0');
	});
	test('returns 0 when missing SNXPrice', () => {
		expect(
			getStakingAmount({
				issuanceRatio: 100,
				mintAmount: 100,
				SNXPrice: 0,
			})
		).toBe('0');
	});
	test('returns correct formatted currency', () => {
		expect(
			getStakingAmount({
				issuanceRatio: 0.13333333333333333,
				mintAmount: '100',
				SNXPrice: 1.37331447542872,
			})
		).toBe('546.12');
	});
});
