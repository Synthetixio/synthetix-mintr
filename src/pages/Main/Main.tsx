import React, { FC } from 'react';
import styled from 'styled-components';
import Dashboard from 'screens/Dashboard';
import MintrPanel from 'screens/MintrPanel';
import BannerL2 from 'components/Banner/BannerL2';
import BannerGoerliAirdrop from 'components/Banner/BannerGoerliAirdrop';
import LiquidationBanner from 'components/BannerLiquidation';

type MainProps = {
	wallet: string;
};

const Main: FC<MainProps> = ({ wallet }) => {
	return (
		<>
			<BannerL2 />
			<BannerGoerliAirdrop />
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
