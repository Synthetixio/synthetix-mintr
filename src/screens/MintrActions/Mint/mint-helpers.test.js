import { getStakingAmount, estimateCRatio } from './mint-helpers';

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

describe('estimateCRatio', () => {
	test('handle empty string mint amount', () => {
		const arg = {
			SNXPrice: 1.3482923239482243,
			debtBalance: 1169.1068040800776,
			snxBalance: 11927.582086160464,
			mintAmount: '',
		};
		expect(estimateCRatio(arg)).toBe(1376);
	});
	test('calculates real life example correctly', () => {
		const arg = {
			SNXPrice: 1.3482923239482243,
			debtBalance: 1169.1068040800776,
			snxBalance: 11927.582086160464,
			mintAmount: 10,
		};
		expect(estimateCRatio(arg)).toBe(1364);
	});
});
