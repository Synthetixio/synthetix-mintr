import { getSusdInUsd } from './fetchData';

describe('getSusdInUsd', () => {
	test('converts correctly', () => {
		const synthRates = {
			susd: 1,
			seth: 150.89559276124712,
		};
		const sethToEthRate = 0.9838261979298352;
		const result = getSusdInUsd(synthRates, sethToEthRate);
		expect(result).toBe(0.9838261979298352);
	});
});
