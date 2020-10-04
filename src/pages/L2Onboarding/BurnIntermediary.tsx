import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { HeaderIcon } from 'components/L2Onboarding/HeaderIcon';
import { Stepper } from 'components/L2Onboarding/Stepper';
import { ReactComponent as BurnErrorIcon } from '../../assets/images/L2/burn-error.svg';
import { ReactComponent as TradeIcon } from '../../assets/images/L2/trade-swap.svg';
import { ReactComponent as DEXAG } from '../../assets/images/L2/dx-ag.svg';
import { fontFamilies } from 'styles/themes';
import { connect } from 'react-redux';
import { setRedirectToTrade } from '../../ducks/ui';
import { getWalletBalancesWithRates } from 'ducks/balances';
import OneInchCard from 'screens/MintrActions/Migrate/OneInchCard';

interface BurnIntermediaryProps {
	totalsUSDDebt: number;
	setRedirectToTrade: Function;
	walletBalancesWithRates: any;
}

const BurnIntermediary: React.FC<BurnIntermediaryProps> = ({
	totalsUSDDebt,
	setRedirectToTrade,
	walletBalancesWithRates,
}) => {
	const [usdValueOfSynths, setUSDValueOfSynths] = useState<number>(0);
	const [showOneInchCard, setShowOneInchCard] = useState<boolean>(false);
	const calculateUSDSumOfSynths = useCallback(() => {
		const balances = walletBalancesWithRates.synths.map(synth => synth.valueUSD);
		if (balances > 0) {
			const sumOfSynths = balances.reduce((a, b) => {
				return a + b;
			});
			setUSDValueOfSynths(sumOfSynths);
		} else {
			setUSDValueOfSynths(0);
		}
	}, [walletBalancesWithRates]);

	useEffect(() => {
		if (!walletBalancesWithRates) return;
		const calculateUSDSumOfSynths = () => {
			const balances = walletBalancesWithRates.synths.map(synth => synth.valueUSD);
			if (balances > 0) {
				const sumOfSynths = balances.reduce((a, b) => {
					return a + b;
				});
				setUSDValueOfSynths(sumOfSynths);
			} else {
				setUSDValueOfSynths(0);
			}
		};
		calculateUSDSumOfSynths();
	}, [calculateUSDSumOfSynths, walletBalancesWithRates]);
	const handleRedirectToTrade = () => {
		setRedirectToTrade(true);
	};

	return (
		<PageContainer>
			<Stepper activeIndex={0} />
			<HeaderIcon
				title="Burn all L1 debt"
				subtext={
					showOneInchCard
						? 'Before you can burn all your debt, you need to buy sUSD.'
						: 'You currently don’t have enough sUSD to burn your L1 debt. To get more sUSD, either trade your other Synths for sUSD or purchase sUSD directly via Curve or Uniswap.'
				}
				icon={<BurnErrorIcon />}
			/>
			{!!showOneInchCard ? (
				<OneInchCard />
			) : (
				<>
					<Flex>
						<Subtitle>REQUIRED AMOUNT:</Subtitle>
						<Subtext>{totalsUSDDebt} sUSD</Subtext>
					</Flex>
					<Flex>
						<ContainerButton onClick={() => handleRedirectToTrade()} href={null} target="_blank">
							<ButtonIcon>
								<TradeIcon />
							</ButtonIcon>
							<ButtonTitle>TRADE SYNTHS</ButtonTitle>
							<ButtonSubtext>`Balance: $${usdValueOfSynths} USD`</ButtonSubtext>
						</ContainerButton>
						<ContainerButton onClick={() => setShowOneInchCard(true)} href={null} target="_blank">
							<ButtonIcon>
								<DEXAG />
							</ButtonIcon>
							<ButtonTitle>BUY sUSD</ButtonTitle>
							<ButtonSubtext>from your favourite decentralized exchange</ButtonSubtext>
						</ContainerButton>
					</Flex>
				</>
			)}
		</PageContainer>
	);
};

const PageContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const Flex = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
	margin: 16px 0px;
`;

const Subtitle = styled.p`
	font-family: ${fontFamilies.regular};
	font-size: 20px;
	line-height: 24px;
	text-align: center;
	letter-spacing: 0.2px;
	color: #cacaf1;
	margin-right: 8px;
`;

const Subtext = styled.p`
	font-family: ${fontFamilies.regular};
	font-size: 20px;
	line-height: 24px;
	text-align: center;
	letter-spacing: 0.2px;
	color: #ffffff;
`;

const ContainerButton = styled.a`
	background: #282862;
	border: 1px solid #282862;
	box-sizing: border-box;
	border-radius: 5px;
	display: flex;
	justify-content: center;
	width: 400px;
	flex-direction: column;
	align-items: center;
	margin: 0px 8px;
	height: 250px;
	cursor: pointer;
`;

const ButtonIcon = styled.div`
	display: flex;
`;

const ButtonTitle = styled.p`
	font-family: ${fontFamilies.regular};
	font-size: 24px;
	line-height: 29px;
	text-align: center;
	letter-spacing: 1.5px;
	color: #ffffff;
`;

const ButtonSubtext = styled.p`
	font-family: ${fontFamilies.regular};
	font-size: 16px;
	line-height: 100%;
	text-align: center;
	letter-spacing: 0.2px;
	color: #cacaf1;
`;

const mapStateToProps = (state: any) => ({
	walletBalancesWithRates: getWalletBalancesWithRates(state),
});

const mapDispatchToProps = {
	setRedirectToTrade,
};

export default connect(mapStateToProps, mapDispatchToProps)(BurnIntermediary);
