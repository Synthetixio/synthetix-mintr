import React, { useState } from 'react';
import styled from 'styled-components';

import PageContainer from '../../components/PageContainer';
import Slider from '../../components/ScreenSlider';
import Create from './Create';
import Confirm from './Confirm';
import List from './List';

const getComponent = page => {
	switch (page) {
		case 'create':
			return Create;
		case 'confirm':
			return Confirm;
		default:
			return null;
	}
};

const SETHPoolRewardDistribution = () => {
	const [page, setPage] = useState(null);
	const [multisendTx, setMultisendTx] = useState(null);
	let slider = null;
	if (page) {
		const PageComponent = getComponent(page);
		slider = (
			<Slider>
				<PageComponent goHome={() => setPage(null)} multisendTx={multisendTx} />
			</Slider>
		);
	}
	const openDetails = id => {
		setMultisendTx(id);
		setPage('confirm');
	};
	return (
		<MainContainerWrapper>
			<PageContainer>
				{slider}
				<List setPage={setPage} openDetails={openDetails} />
			</PageContainer>
		</MainContainerWrapper>
	);
};

const MainContainerWrapper = styled('div')`
	width: 100%;
	background-color: ${props => props.theme.colorStyles.background};
`;

export default SETHPoolRewardDistribution;
