import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import UnipoolSETH from './UniPoolSETH';
import UniPoolSXAU from './UnipoolSXAU';
import CurvePool from './CurvePoolSUSD';
import IEth from './IEth';

import { H1, PageTitle } from '../../../components/Typography';
import PageContainer from '../../../components/PageContainer';

const POOLS = [
	{
		title: 'lpRewards.actions.unipoolSETH.title',
		name: 'unipoolSETH',
		image: '/images/pools/unipool-sETH.svg',
	},
	{
		title: 'lpRewards.actions.unipoolSXAU.title',
		name: 'unipoolSXAU',
		image: '/images/pools/unipool-sXAU.svg',
	},
	{
		title: 'lpRewards.actions.curvepool.title',
		name: 'iearn',
		image: '/images/pools/iearn.svg',
	},
	{ title: 'lpRewards.actions.ieth.title', name: 'ieth', image: '/images/currencies/iETH.svg' },
];

const LPRewards = () => {
	const { t } = useTranslation();
	const [currentPool, setCurrentPool] = useState(null);
	const goBack = () => setCurrentPool(null);

	const getPoolComponent = poolName => {
		switch (poolName) {
			case 'unipoolSETH':
				return <UnipoolSETH goBack={goBack} />;
			case 'unipoolSXAU':
				return <UniPoolSXAU goBack={goBack} />;
			case 'iearn':
				return <CurvePool goBack={goBack} />;
			case 'ieth':
				return <IEth goBack={goBack} />;
		}
	};

	return (
		<PageContainer>
			{currentPool ? (
				getPoolComponent(currentPool)
			) : (
				<>
					<PageTitle>{t('lpRewards.intro.title')}</PageTitle>
					<ButtonRow>
						{POOLS.map(({ title, name, image }, i) => {
							return (
								<Button key={`button-${i}`} onClick={() => setCurrentPool(name)}>
									<ButtonContainer>
										<ActionImage src={image} big />
										<StyledHeading>{t(title)}</StyledHeading>
									</ButtonContainer>
								</Button>
							);
						})}
					</ButtonRow>
				</>
			)}
		</PageContainer>
	);
};

const Button = styled.button`
	cursor: pointer;
	height: 250px;
	background-color: ${props => props.theme.colorStyles.panelButton};
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 5px;
	box-shadow: 0px 5px 10px 5px ${props => props.theme.colorStyles.shadow1};
	transition: transform ease-in 0.2s;
	&:hover {
		background-color: ${props => props.theme.colorStyles.panelButtonHover};
		box-shadow: 0px 5px 10px 8px ${props => props.theme.colorStyles.shadow1};
		transform: translateY(-2px);
	}
`;

const ButtonContainer = styled.div`
	padding: 10px;
	margin: 0 auto;
`;

const ButtonRow = styled.div`
	margin-top: 60px;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 20px;
`;

const ActionImage = styled.img`
	height: 64px;
	width: 64px;
`;

const StyledHeading = styled(H1)`
	font-size: 22px;
	text-transform: none;
`;

export default LPRewards;
