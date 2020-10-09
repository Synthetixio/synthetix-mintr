import React from 'react';
import styled from 'styled-components';
import { ReactComponent as DiagonalArrow } from '../../assets/images/L2/DiagonalArrow.svg';
import { setCurrentPage } from '../../ducks/ui';
import { PAGES_BY_KEY } from '../../constants/ui';
import { connect } from 'react-redux';
import { fontFamilies } from 'styles/themes';
import { RootState } from 'ducks/types';
import { getWalletBalances } from 'ducks/balances';
import { CRYPTO_CURRENCY_TO_KEY } from 'constants/currency';
import { getWalletDetails } from 'ducks/wallet';
import { isGoerliTestnet } from 'helpers/networkHelper';

interface L2BannerProps {
	setCurrentPage: Function;
	walletBalances: any;
	walletDetails: any;
}
const L2Banner: React.FC<L2BannerProps> = ({ setCurrentPage, walletBalances, walletDetails }) => {
	// Only show the banner if their SNX balance is 5000 or less
	const showBanner =
		isGoerliTestnet(walletDetails.networkId) &&
		walletBalances &&
		walletBalances.crypto &&
		walletBalances.crypto[CRYPTO_CURRENCY_TO_KEY.SNX] > 0;

	return showBanner ? (
		<ContainerBanner onClick={() => setCurrentPage(PAGES_BY_KEY.L2ONBOARDING)}>
			<StyledPMedium>
				This wallet is eligible to participate in the Optimistic Ethereum L2 Testnet Trial - Try it
				out now and earn L2 SNX rewards!
			</StyledPMedium>
			<DiagonalArrow />
		</ContainerBanner>
	) : null;
};

const ContainerBanner = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 2px;
	width: 100%;
	background: linear-gradient(100.67deg, #0885fe 34.26%, #4e3cbd 69.86%);
	color: white;
	cursor: pointer;
`;
const StyledPMedium = styled.p`
	font-size: 14px;
	line-height: 16px;
	font-family: ${fontFamilies.regular};
	color: white;
	text-transform: uppercase;
	margin-right: 4px;
`;

const mapStateToProps = (state: RootState) => ({
	walletBalances: getWalletBalances(state),
	walletDetails: getWalletDetails(state),
});

const mapDispatchToProps = {
	setCurrentPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(L2Banner);
