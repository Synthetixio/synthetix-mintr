import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { ReactComponent as CloseIcon } from '../../assets/images/close-icon.svg';
import { setCurrentPage } from '../../ducks/ui';
import { PAGES_BY_KEY } from 'constants/ui';
import { connect } from 'react-redux';
import { fontFamilies } from 'styles/themes';
import { Welcome } from './Welcome';
import Deposit from './Deposit';
import { Metamask } from './Metamask';
import { Success } from './Success';
import Burn from './Burn';
import BurnIntermediary from './BurnIntermediary';
import { useGetDebtData } from './hooks/useGetDebtData';
import { bytesFormatter, bigNumberFormatter } from 'helpers/formatters';
import { getWalletDetails } from 'ducks/wallet';
import snxJSConnector from '../../helpers/snxJSConnector';
import Spinner from '../../components/Spinner';
import { getWalletBalancesWithRates } from 'ducks/balances';

interface L2OnboardingProps {
	setCurrentPage: Function;
	walletDetails: any;
}

export const L2Onboarding: React.FC<L2OnboardingProps> = ({ setCurrentPage, walletDetails }) => {
	const [step, setStep] = useState<number>(0);
	const [sufficientBalance, setSufficientBalance] = useState<boolean | string>('');
	const [checkingBalances, setCheckingBalances] = useState<boolean>(true);
	const [sUSDBalance, setSUSDBalance] = useState<number>(0);
	const { currentWallet } = walletDetails;
	const sUSDBytes = bytesFormatter('sUSD');
	const debtData = useGetDebtData(currentWallet, sUSDBytes);

	const fetchDepotData = useCallback(async () => {
		try {
			const sUsdWalletBalance = await snxJSConnector.snxJS.sUSD.balanceOf(currentWallet);
			setSUSDBalance(bigNumberFormatter(sUsdWalletBalance));
		} catch (e) {
			console.log(e);
		}
	}, [currentWallet]);

	const validateAvailableBalance = useCallback(() => {
		if (debtData.sUSDBalance) {
			if (sUSDBalance >= debtData.sUSDBalance) {
				setSufficientBalance(true);
				setCheckingBalances(false);
			} else {
				setSufficientBalance(false);
				setCheckingBalances(false);
			}
		}
	}, [debtData, sUSDBalance]);

	useEffect(() => {
		fetchDepotData();
		if (debtData) {
			validateAvailableBalance();
		}
		const refreshInterval = setInterval(validateAvailableBalance, 5000);
		return () => clearInterval(refreshInterval);
	}, [fetchDepotData, validateAvailableBalance, debtData]);

	const handleFinish = () => {
		// Direct to Mintr.io
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
					if (sufficientBalance) {
						return <Burn onComplete={() => setStep(2)} />;
					} else {
						return <BurnIntermediary totalsUSDDebt={debtData.sUSDBalance} />;
					}
				}
			case 2:
				return <Deposit onComplete={() => setStep(3)} />;
			case 3:
				return <Metamask onComplete={() => setStep(4)} />;
			case 4:
				return <Success onComplete={() => handleFinish()} />;
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
	font-family: ${fontFamilies.regular};
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
});

const mapDispatchToProps = {
	setCurrentPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(L2Onboarding);
