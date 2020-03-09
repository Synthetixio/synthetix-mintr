import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import snxJSConnector from '../../helpers/snxJSConnector';
import { getNetworkInfo } from '../../helpers/networkHelper';
import { bytesFormatter, bigNumberFormatter } from '../../helpers/formatters';

import { updateNetworkInfo } from '../../ducks/network';
import { fetchRates } from '../../ducks/rates';

import Dashboard from '../../screens/Dashboard';
import MintrPanel from '../../screens/MintrPanel';

const Main = ({ updateNetworkInfo, fetchRates }) => {
	useEffect(() => {
		const fetchNetworkInfo = async () => {
			fetchRates();
			// 	try {
			// 		const [networkInfo, ethPrice] = await Promise.all([
			// 			getNetworkInfo(),
			// 			snxJSConnector.snxJS.ExchangeRates.rateForCurrency(bytesFormatter('ETH')),
			// 		]);
			// 		updateNetworkInfo(networkInfo, bigNumberFormatter(ethPrice));
			// 	} catch (e) {
			// 		console.log('Error while trying to fetch network data', e);
			// 	}
		};
		const fetchLoop = setInterval(fetchNetworkInfo, 5 * 60 * 1000);
		fetchNetworkInfo();
		return () => clearInterval(fetchLoop);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<MainWrapper>
			<Dashboard />
			<MintrPanel />
		</MainWrapper>
	);
};

const MainWrapper = styled.div`
	display: flex;
	width: 100%;
`;

const mapDispatchToProps = {
	updateNetworkInfo,
	fetchRates,
};

export default connect(null, mapDispatchToProps)(Main);
