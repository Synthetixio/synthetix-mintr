import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { ReactComponent as CloseIcon } from '../../assets/images/L2/close-icon.svg';
import { setCurrentPage } from '../../ducks/ui';
import { PAGES_BY_KEY } from 'constants/ui';
import { connect } from 'react-redux';
import { bigNumberFormatter } from 'helpers/formatters';
import { getWalletDetails } from 'ducks/wallet';
import snxJSConnector from '../../helpers/snxJSConnector';
import Spinner from '../../components/Spinner';
import { getWalletBalancesWithRates } from 'ducks/balances';
import { getDebtStatusData } from 'ducks/debtStatus';

import Welcome from './Welcome';
import Deposit from './Deposit';
import Success from './Success';
import Burn from './Burn';
import BurnIntermediary from './BurnIntermediary';
import SwitchInProgress from './SwitchInProgress';

interface L2OnboardingProps {
	setCurrentPage: Function;
	walletDetails: any;
	debtDataStatus: any;
}

export const L2Onboarding: React.FC<L2OnboardingProps> = ({
	setCurrentPage,
	walletDetails: { currentWallet, networkId },
	debtDataStatus,
}) => {
	const [step, setStep] = useState<number>(0);
	const [sufficientBalance, setSufficientBalance] = useState<boolean | string>('');
	const [checkingBalances, setCheckingBalances] = useState<boolean>(true);
	const [sUSDBalance, setSUSDBalance] = useState<number>(0);
	const [l1TransactionHash, setL1TransactionHash] = useState(null);
	const [l2TransactionHash, setL2TransactionHash] = useState(null);

	const validateAvailableBalance = useCallback(async () => {
		const sUSDBalanceBN = await snxJSConnector.snxJS.sUSD.balanceOf(currentWallet);
		const sUSDBalanceNB = bigNumberFormatter(sUSDBalanceBN);
		setSUSDBalance(sUSDBalanceNB);

		if (!debtDataStatus) return;
		if (debtDataStatus.debtBalance !== null) {
			if (sUSDBalanceNB >= debtDataStatus.debtBalance) {
				setSufficientBalance(true);
			} else {
				setSufficientBalance(false);
			}
			setCheckingBalances(false);
		}
	}, [debtDataStatus, currentWallet]);

	useEffect(() => {
		validateAvailableBalance();
		const refreshInterval = setInterval(validateAvailableBalance, 60 * 1000);
		return () => clearInterval(refreshInterval);
	}, [validateAvailableBalance, debtDataStatus]);

	const handleFinish = () => {
		window.open('https://l2.mintr.synthetix.io', '_self');
	};

	const returnStep = () => {
		switch (step) {
			case 0:
				return <Welcome onNext={() => setStep(1)} />;
			case 1:
				if (checkingBalances && typeof sufficientBalance === 'string') {
					return (
						<Center>
							<Spinner />
						</Center>
					);
				} else {
					if (debtDataStatus.debtBalance === 0) {
						setStep(2);
						break;
					} else if (sufficientBalance) {
						return <Burn onComplete={() => setStep(2)} currentsUSDBalance={sUSDBalance} />;
					} else {
						return (
							<BurnIntermediary
								currentsUSDBalance={sUSDBalance}
								totalsUSDDebt={debtDataStatus.debtBalance}
								onComplete={() => validateAvailableBalance()}
							/>
						);
					}
				}
			case 2:
				return (
					<Deposit
						onComplete={transactionHash => {
							setL1TransactionHash(transactionHash);
							setStep(3);
						}}
					/>
				);
			case 3:
				return (
					<SwitchInProgress
						onComplete={transactionHash => {
							setL2TransactionHash(transactionHash);
							setStep(4);
						}}
						networkId={networkId}
						transactionHash={l1TransactionHash}
					/>
				);
			case 4:
				return <Success onComplete={() => handleFinish()} transactionHash={l2TransactionHash} />;
			default:
				return <Welcome onNext={() => setStep(1)} />;
		}
	};
	return (
		<ContainerPage>
			<StyledHeaderRow>
				<StyledCloseIcon onClick={() => setCurrentPage(PAGES_BY_KEY.MAIN)} />
				<Button onClick={() => {}}>READ THE BLOG POST</Button>
			</StyledHeaderRow>
			{returnStep()}
		</ContainerPage>
	);
};

const ContainerPage = styled.div`
	width: 100%;
	height: 100vh;
	padding: 48px;
	background: #020b29;
`;

const Center = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
`;

const StyledCloseIcon = styled(CloseIcon)`
	width: 48px;
	cursor: pointer;
`;

const StyledHeaderRow = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
`;

const Button = styled.button`
	font-family: ${props => props.theme.fontFamilies.regular};
	text-transform: uppercase;
	width: 159px;
	height: 32px;
	background: #282862;
	color: #cacaf1;
	border: none;
`;

const mapStateToProps = (state: any) => ({
	walletDetails: getWalletDetails(state),
	walletBalancesWithRates: getWalletBalancesWithRates(state),
	debtDataStatus: getDebtStatusData(state),
});

const mapDispatchToProps = {
	setCurrentPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(L2Onboarding);
