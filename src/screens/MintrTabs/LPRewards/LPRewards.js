import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import range from 'lodash/range';

import UnipoolSETH from './UniPoolSETH';
import UniPoolSXAU from './UnipoolSXAU';
import CurvePool from './CurvePoolSUSD';
import IEth from './IEth';

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
		name: 'balancer',
		image: '/images/pools/balancer.svg',
		contract: 'balancerRewardsSNXContract',
	},
];

// We are harcoding the addresses here because not every
// contract is in the RewardsDistribution contract
const HARDCODED_REWARDS = {
	'0x8302FE9F0C509a996573D3Cc5B0D5D51e4FDD5eC': 8000, //sXAU
	'0xc746bc860781dc90bbfcd381d6a058dc16357f8d': 16000, //iETH
	'0xFBaEdde70732540cE2B11A8AC58Eb2dC0D69dE10': 8000, //Balancer
};

const LPRewards = () => {
	const { t } = useTranslation();
	const [currentPool, setCurrentPool] = useState(null);
	const [distributions, setDistributions] = useState(HARDCODED_REWARDS);
	const goBack = () => setCurrentPool(null);

	useEffect(() => {
		const {
			snxJS: { RewardsDistribution },
		} = snxJSConnector;
		const getRewardsAmount = async () => {
			try {
				const distributionsCount = await RewardsDistribution.distributionsLength();
				const rewardsDistribution = await Promise.all(
					range(Number(distributionsCount)).map(RewardsDistribution.distributions)
				);
				let rewardsDistributionMapping = {};
				rewardsDistribution.forEach(
					({ amount, destination }) => (rewardsDistributionMapping[destination] = amount / 1e18)
				);
				setDistributions({ ...distributions, ...rewardsDistributionMapping });
			} catch (e) {
				console.log(e);
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
				return <CurvePool goBack={goBack} />;
			case 'ieth':
				return <IEth goBack={goBack} />;
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
							<ButtonRow key={`pool-${i}`} large={i === 0}>
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
												<StyledDataLarge>{formatCurrency(distribution, 0)} SNX</StyledDataLarge>
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
	grid-template-columns: ${props => (props.large ? `repeat(2, 1fr)` : `repeat(3, 1fr)`)};
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
const StyledSubtext = styled(Subtext)`
	text-transform: uppercase;
	margin: 28px 0 12px 0;
`;

export default LPRewards;
