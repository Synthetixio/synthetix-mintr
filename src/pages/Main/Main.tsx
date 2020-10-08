import React, { FC } from 'react';
import styled from 'styled-components';
import Dashboard from 'screens/Dashboard';
import MintrPanel from 'screens/MintrPanel';
import L2Banner from 'components/Banner/L2Banner';
// import l2Wallets from 'assets/data/l2-wallets.json';
const Main: FC<MainProps> = ({ wallet }) => {
	// const bannerIsVisible = l2Wallets.find(
	// 	({ address }) => address.toLowerCase() === wallet.toLowerCase()
	// );
	return (
		<MainWrapper>
			<L2Banner />
			<DashboardWrapper>
				<Dashboard />
				<MintrPanel />
			</DashboardWrapper>
		</MainWrapper>
	);
};
type MainProps = {
	wallet: string;
};
const MainWrapper = styled.div`
	width: 100%;
`;
const DashboardWrapper = styled.div`
	display: flex;
	width: 100%;
`;
export default Main;
