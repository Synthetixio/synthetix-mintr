import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { fetchRates } from '../../ducks/rates';
import { fetchNetworkInfo } from '../../ducks/network';

import Dashboard from '../../screens/Dashboard';
import MintrPanel from '../../screens/MintrPanel';

const Main = ({ fetchNetworkInfo, fetchRates }) => {
	useEffect(() => {
		const init = async () => {
			fetchRates();
			fetchNetworkInfo();
		};
		init();
		const fetchLoop = setInterval(init, 5 * 60 * 1000);
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
	fetchNetworkInfo,
	fetchRates,
};

export default connect(null, mapDispatchToProps)(Main);
