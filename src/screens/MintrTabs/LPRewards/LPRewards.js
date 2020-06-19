import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import UnipoolSETH from './UniPoolSETH';
import UniPoolSXAU from './UnipoolSXAU';
import CurvePoolSUSD from './CurvePoolSUSD';
import CurvePoolSBTC from './CurvePoolSBTC';
import IEth from './IEth';
import BalancerSNX from './BalancerSNX';

import { H1, PageTitle, Subtext, DataLarge } from '../../../components/Typography';
import PageContainer from '../../../components/PageContainer';
import snxJSConnector from 'helpers/snxJSConnector';
import { formatCurrency } from 'helpers/formatters';

const POOLS_MAJOR = [
	{
		title: 'lpRewards.actions.unipoolSETH.title',
		name: 'unipoolSETH',
		image: '/images/pools/unipool-sETH.svg',
		contract: 'unipoolSETHContract',
	},
	{
		title: 'lpRewards.actions.unipoolSXAU.title',
		name: 'unipoolSXAU',
		image: '/images/pools/unipool-sXAU.svg',
		contract: 'unipoolSXAUContract',
	},
	{
		title: 'lpRewards.actions.curvepoolSBTC.title',
		name: 'curvepoolSBTC',
		image: '/images/pools/iearn-sBTC.svg',
		contract: 'sBTCRewardsContract',
	},
];

const POOLS_SECONDARY = [
	{
		title: 'lpRewards.actions.curvepool.title',
		name: 'iearn',
		image: '/images/pools/iearn.svg',
		contract: 'curvepoolContract',
	},
	{
		title: 'lpRewards.actions.ieth.title',
		name: 'ieth',
		image: '/images/currencies/iETH.svg',
		contract: 'iEthRewardsContract',
	},
	{
		title: 'lpRewards.actions.balancer.title',
		name: 'balancerSNX',
		image: '/images/pools/balancer-SNX.svg',
		contract: 'balancerSNXRewardsContract',
	},
];

const LPRewards = () => {
	const { t } = useTranslation();
	const [currentPool, setCurrentPool] = useState(null);
	const [distributions, setDistributions] = useState({});
	const goBack = () => setCurrentPool(null);

	useEffect(() => {
		const {
			unipoolSXAUContract,
			unipoolSETHContract,
			curvepoolContract,
			iEthRewardsContract,
			balancerSNXRewardsContract,
		} = snxJSConnector;

		const getRewardsAmount = async () => {
			try {
				const contracts = [
					unipoolSXAUContract,
					unipoolSETHContract,
					curvepoolContract,
					iEthRewardsContract,
					balancerSNXRewardsContract,
				];
				const rewardsData = await Promise.all(
					contracts.map(contract => Promise.all([contract.DURATION(), contract.rewardRate()]))
				);
				let contractRewards = {};
				rewardsData.forEach(([duration, rate], i) => {
					contractRewards[contracts[i].address] = Math.trunc(Number(duration) * (rate / 1e18));
				});
				setDistributions(contractRewards);
			} catch (e) {
				console.log(e);
				setDistributions({});
			}
		};
		getRewardsAmount();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getPoolComponent = poolName => {
		switch (poolName) {
			case 'unipoolSETH':
				return <UnipoolSETH goBack={goBack} />;
			case 'unipoolSXAU':
				return <UniPoolSXAU goBack={goBack} />;
			case 'iearn':
				return <CurvePoolSUSD goBack={goBack} />;
			case 'curvepoolSBTC':
				return <CurvePoolSBTC goBack={goBack} />;
			case 'ieth':
				return <IEth goBack={goBack} />;
			case 'balancerSNX':
				return <BalancerSNX goBack={goBack} />;
			default:
				return null;
		}
	};

	return (
		<PageContainer>
			{currentPool ? (
				getPoolComponent(currentPool)
			) : (
				<>
					<PageTitle>{t('lpRewards.intro.title')}</PageTitle>
					{[POOLS_MAJOR, POOLS_SECONDARY].map((pools, i) => {
						return (
							<ButtonRow key={`pool-${i}`}>
								{pools.map(({ title, name, image, contract }, i) => {
									const distribution = distributions[snxJSConnector[contract].address] || 0;
									return (
										<Button key={`button-${i}`} onClick={() => setCurrentPool(name)}>
											<ButtonContainer>
												<ButtonHeading>
													<ActionImage src={image} big />
													<StyledHeading>{t(title)}</StyledHeading>
												</ButtonHeading>
												<StyledSubtext>{t('lpRewards.shared.info.weeklyRewards')}:</StyledSubtext>
												{name === 'curvepoolSBTC' ? (
													<DistributionRow>
														<StyledDataLarge>10,000 SNX</StyledDataLarge>
														<StyledDataLarge>25,000 REN</StyledDataLarge>
													</DistributionRow>
												) : (
													<StyledDataLarge>{formatCurrency(distribution, 0)} SNX</StyledDataLarge>
												)}
											</ButtonContainer>
										</Button>
									);
								})}
							</ButtonRow>
						);
					})}
				</>
			)}
		</PageContainer>
	);
};

const Button = styled.button`
	cursor: pointer;
	height: 350px;
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

const ButtonHeading = styled.div`
	height: 128px;
`;

const ButtonRow = styled.div`
	margin-top: 20px;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
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

const StyledDataLarge = styled(DataLarge)`
	color: ${props => props.theme.colorStyles.body};
	font-size: 22px;
`;

const DistributionRow = styled.div`
	display: flex;
	flex-direction: column;
	& > :not(:first-child) {
		margin-top: 10px;
	}
`;

const StyledSubtext = styled(Subtext)`
	text-transform: uppercase;
	margin: 28px 0 12px 0;
`;

export default LPRewards;
