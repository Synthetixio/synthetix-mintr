import React, { FC } from 'react';
import styled from 'styled-components';

import Dashboard from 'screens/Dashboard';
import MintrPanel from 'screens/MintrPanel';
import L2Banner from 'components/Banner/L2Banner';

const Main: FC = () => (
	<MainWrapper>
		<L2Banner />
		<DashboardWrapper>
			<Dashboard />
			<MintrPanel />
		</DashboardWrapper>
	</MainWrapper>
);

const MainWrapper = styled.div`
	width: 100%;
`;

const DashboardWrapper = styled.div`
	display: flex;
	width: 100%;
`;

export default Main;
