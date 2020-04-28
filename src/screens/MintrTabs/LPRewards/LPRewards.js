import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import UniPool from './UniPool';
import CurvePool from './CurvePool';
import IEth from './IEth';

import { H1, PageTitle } from '../../../components/Typography';
import PageContainer from '../../../components/PageContainer';

const POOLS = [
	{
		title: 'lpRewards.actions.unipool.title',
		name: 'uniswap',
		image: '/images/pools/uniswap.svg',
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
			case 'uniswap':
				return <UniPool goBack={goBack} />;
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
	flex: 1;
	cursor: pointer;
	height: 352px;
	max-width: 352px;
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
	&:not(:first-child) {
		margin-left: 20px;
	}
`;

const ButtonContainer = styled.div`
	padding: 10px;
	margin: 0 auto;
`;

const ButtonRow = styled.div`
	display: flex;
	justify-content: space-between;
	margin: ${props => (props.margin ? props.margin : 0)};
`;

const ActionImage = styled.img`
	height: ${props => (props.big ? '64px' : '48px')};
	width: ${props => (props.big ? '64px' : '48px')};
`;

const StyledHeading = styled(H1)`
	font-size: 22px;
`;

export default LPRewards;
