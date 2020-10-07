import React, { FC } from 'react';
import styled from 'styled-components';

import Dashboard from 'screens/Dashboard';
import MintrPanel from 'screens/MintrPanel';
import L2Banner from 'components/BannerL2';
import LiquidationBanner from 'components/BannerLiquidation';
import l2Wallets from 'assets/data/l2-wallets.json';

type MainProps = {
	wallet: string;
};

const Main: FC<MainProps> = ({ wallet }) => {
	const l2BannerIsVisible = l2Wallets.find(
		({ address }) => address.toLowerCase() === wallet.toLowerCase()
	);

	return (
		<>
			{l2BannerIsVisible ? <L2Banner /> : null}
			<LiquidationBanner />
			<MainWrapper>
				<Dashboard />
				<MintrPanel />
			</MainWrapper>
		</>
	);
};

const MainWrapper = styled.div`
	display: flex;
	width: 100%;
`;

export default Main;
