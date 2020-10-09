import React, { FC } from 'react';
import styled from 'styled-components';
import Dashboard from 'screens/Dashboard';
import MintrPanel from 'screens/MintrPanel';
import L2Banner from 'components/Banner/L2Banner';
import LiquidationBanner from 'components/BannerLiquidation';

type MainProps = {
	wallet: string;
};

const Main: FC<MainProps> = ({ wallet }) => {
	return (
		<>
			<L2Banner />
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
