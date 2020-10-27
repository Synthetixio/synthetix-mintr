import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import UnipoolSETH from './UniPoolSETH';
import CurvePoolSUSD from './CurvePoolSUSD';
import CurvePoolSBTC from './CurvePoolSBTC';
import IEth from './IEth';
import IBtc from './IBtc';
import BalancerSNX from './BalancerSNX';

import { getCurrentTheme } from 'ducks/ui';

import PageContainer from 'components/PageContainer';
import { Info } from 'components/Icons';
import Tooltip from 'components/Tooltip';

import { FlexDivCentered } from 'styles/common';
import { H1, PageTitle, Subtext, DataLarge, PMedium } from 'components/Typography';

import snxJSConnector from 'helpers/snxJSConnector';
import { formatCurrency } from 'helpers/formatters';

const POOLS_MAJOR = [
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
		contract: 'iEth4RewardsContract',
	},
	{
		title: 'lpRewards.actions.ibtc.title',
		name: 'ibtc',
		image: '/images/currencies/iBTC.svg',
		contract: 'iBtcRewardsContract',
	},
];

const POOLS_SECONDARY = [
	{
		title: 'lpRewards.actions.curvepoolSBTC.title',
		name: 'curvepoolSBTC',
		image: '/images/pools/iearn-sBTC.svg',
		contract: 'sBTCRewardsContract',
	},
	{
		title: 'lpRewards.actions.unipoolSETH.title',
		name: 'unipoolSETH',
		image: '/images/pools/unipool-sETH.svg',
		contract: 'unipoolSETHContract',
	},
	{
		title: 'lpRewards.actions.balancer.title',
		name: 'balancerSNX',
		image: '/images/pools/balancer-SNX.svg',
		contract: 'balancerSNXRewardsContract',
	},
];

const POOLS_COMPLETED = ['curvepoolSBTC', 'unipoolSETH', 'balancerSNX'];

const LPRewards = ({ currentTheme }) => {
	const { t } = useTranslation();
	const [currentPool, setCurrentPool] = useState(null);
	const [distributions, setDistributions] = useState({});
	const goBack = () => setCurrentPool(null);

	useEffect(() => {
		const { curvepoolContract, iEth4RewardsContract, iBtcRewardsContract } = snxJSConnector;

		const getRewardsAmount = async () => {
			try {
				const contracts = [curvepoolContract, iEth4RewardsContract, iBtcRewardsContract];
				const rewardsData = await Promise.all(
					contracts.map(contract => {
						const getDuration = contract.DURATION || contract.rewardsDuration;
						return Promise.all([getDuration(), contract.rewardRate(), contract.periodFinish()]);
					})
				);
				let contractRewards = {};
				rewardsData.forEach(([duration, rate, periodFinish], i) => {
					const durationInWeeks = Number(duration) / 3600 / 24 / 7;
					const isPeriodFinished = new Date().getTime() > Number(periodFinish) * 1000;
					contractRewards[contracts[i].address] = isPeriodFinished
						? 0
						: Math.trunc(Number(duration) * (rate / 1e18)) / durationInWeeks;
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
			case 'iearn':
				return <CurvePoolSUSD goBack={goBack} />;
			case 'curvepoolSBTC':
				return <CurvePoolSBTC goBack={goBack} />;
			case 'ieth':
				return <IEth goBack={goBack} />;
			case 'ibtc':
				return <IBtc goBack={goBack} />;
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
												{!POOLS_COMPLETED.includes(name) ? (
													<StyledDataLarge>{formatCurrency(distribution, 0)} SNX</StyledDataLarge>
												) : (
													<CompletedLabel>
														<CompletedLabelHeading>
															{t('lpRewards.intro.completed')}
														</CompletedLabelHeading>
														<Tooltip
															mode={currentTheme}
															title={t('tooltip.poolCompleted')}
															placement="top"
														>
															<TooltipIconContainer>
																<Info />
															</TooltipIconContainer>
														</Tooltip>
													</CompletedLabel>
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

const CompletedLabel = styled(FlexDivCentered)`
	justify-content: center;
	border-radius: 1000px;
	background-color: ${props => props.theme.colorStyles.borders};
	padding: 4px 15px;
`;

const CompletedLabelHeading = styled(PMedium)`
	margin: 0;
	font-size: 14px;
	text-transform: uppercase;
`;

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

const StyledSubtext = styled(Subtext)`
	text-transform: uppercase;
	margin: 28px 0 12px 0;
`;

const TooltipIconContainer = styled.div`
	margin-left: 6px;
	width: 23px;
	height: 23px;
`;

const mapStateToProps = state => ({
	currentTheme: getCurrentTheme(state),
});

export default connect(mapStateToProps, null)(LPRewards);
