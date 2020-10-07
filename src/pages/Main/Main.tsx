import React, { FC } from 'react';
import styled from 'styled-components';

import Dashboard from 'screens/Dashboard';
import MintrPanel from 'screens/MintrPanel';
import Banner from 'components/BannerL2';
import l2Wallets from 'assets/data/l2-wallets.json';

type MainProps = {
	wallet: string;
};

const Main: FC<MainProps> = ({ wallet }) => {
	console.log(wallet);
	const bannerIsVisible = l2Wallets.find(
		({ address }) => address.toLowerCase() === wallet.toLowerCase()
	);
	return (
		<>
			{bannerIsVisible ? <Banner /> : null}
			<MainWrapper>
				<Dashboard />
				<MintrPanel />
			</MainWrapper>
		</>
	);
};

const MainWrapper = styled.div`
	width: 100%;
`;

const DashboardWrapper = styled.div`
	display: flex;
	width: 100%;
`;

export default Main;
