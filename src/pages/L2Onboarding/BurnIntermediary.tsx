import React, { useState } from 'react';
import styled from 'styled-components';

import { HeaderIcon } from 'components/L2Onboarding/HeaderIcon';
import { Stepper } from 'components/L2Onboarding/Stepper';
import { ReactComponent as BurnErrorIcon } from '../../assets/images/L2/burn-error.svg';
import { ReactComponent as TradeIcon } from '../../assets/images/L2/trade-swap.svg';
import { ReactComponent as OneInchIcon } from '../../assets/images/L2/1inch.svg';
import { fontFamilies } from 'styles/themes';
import { connect } from 'react-redux';
import { setRedirectToTrade } from '../../ducks/ui';
import { getTotalSynthsBalance } from 'ducks/balances';
import OneInchCard from 'pages/L2Onboarding/OneInchCard';
import { formatCurrency } from 'helpers/formatters';

interface BurnIntermediaryProps {
	totalsUSDDebt: number;
	setRedirectToTrade: Function;
	totalSynthsBalance: number;
	onComplete: Function;
}

const HEADER_CONTENT = {
	default: {
		title: 'Burn all L1 debt',
		subtext:
			'You currently don’t have enough sUSD to burn your L1 debt. To get more sUSD, either trade your other Synths for sUSD or purchase sUSD directly via 1inch.',
		icon: <BurnErrorIcon />,
	},
	'1inch': {
		title: 'Buy sUSD with ETH via 1inch',
		subtext: '',
		icon: <OneInchIcon />,
	},
};

const BurnIntermediary: React.FC<BurnIntermediaryProps> = ({
	totalsUSDDebt,
	setRedirectToTrade,
	totalSynthsBalance,
	onComplete,
}) => {
	const [showOneInchCard, setShowOneInchCard] = useState<boolean>(false);

	const handleRedirectToTrade = () => {
		setRedirectToTrade(true);
	};

	const renderDefaultLayout = () => (
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
					<ButtonSubtext>{`Balance: $${formatCurrency(
						totalSynthsBalance || 0
					)} USD`}</ButtonSubtext>
				</ContainerButton>
				<ContainerButton onClick={() => setShowOneInchCard(true)} href={null} target="_blank">
					<ButtonIcon>
						<OneInchIcon />
					</ButtonIcon>
					<ButtonTitle>BUY sUSD</ButtonTitle>
					<ButtonSubtext>from 1inch</ButtonSubtext>
				</ContainerButton>
			</Flex>
		</>
	);

	const headerIconContent = HEADER_CONTENT[showOneInchCard ? '1inch' : 'default'];
	return (
		<PageContainer>
			<Stepper activeIndex={0} />
			<HeaderIcon
				title={headerIconContent.title}
				subtext={headerIconContent.subtext}
				icon={headerIconContent.icon}
			/>
			{showOneInchCard ? <OneInchCard onComplete={onComplete} /> : renderDefaultLayout()}
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
	background: #1b1b3f;
	box-sizing: border-box;
	border-radius: 5px;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	margin: 0px 8px;
	height: 221px;
	width: 280px;
	cursor: pointer;
	&:hover {
		background: #282862;
	}
`;

const ButtonIcon = styled.div`
	display: flex;
`;

const ButtonTitle = styled.h3`
	font-family: ${fontFamilies.regular};
	font-size: 24px;
	line-height: 29px;
	text-align: center;
	letter-spacing: 1.5px;
	color: #ffffff;
	margin: 26px 0 9px 0;
`;

const ButtonSubtext = styled.p`
	font-family: ${fontFamilies.regular};
	font-size: 16px;
	line-height: 100%;
	margin: 0;
	text-align: center;
	letter-spacing: 0.2px;
	color: #cacaf1;
`;

const mapStateToProps = (state: any) => ({
	totalSynthsBalance: getTotalSynthsBalance(state),
});

const mapDispatchToProps = {
	setRedirectToTrade,
};

export default connect(mapStateToProps, mapDispatchToProps)(BurnIntermediary);
