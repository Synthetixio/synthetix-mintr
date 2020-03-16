import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { fetchRates } from '../../ducks/rates';
import { fetchGasPrices } from '../../ducks/network';

import Dashboard from '../../screens/Dashboard';
import MintrPanel from '../../screens/MintrPanel';

import { INTERVAL_TIMER } from '../../constants/ui';

const Main = ({ fetchGasPrices, fetchRates }) => {
	useEffect(() => {
		const init = async () => {
			fetchRates();
			fetchGasPrices();
		};
		init();
		const fetchLoop = setInterval(init, INTERVAL_TIMER);
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
	fetchGasPrices,
	fetchRates,
};

export default connect(null, mapDispatchToProps)(Main);
