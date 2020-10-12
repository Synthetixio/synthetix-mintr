import React from 'react';
import styled from 'styled-components';
import { ReactComponent as DiagonalArrow } from '../../assets/images/L2/DiagonalArrow.svg';
import { setCurrentPage } from '../../ducks/ui';
import { PAGES_BY_KEY } from '../../constants/ui';
import { connect } from 'react-redux';
import { fontFamilies } from 'styles/themes';
import { RootState } from 'ducks/types';
import { getSNXBalance } from 'ducks/balances';
import { getWalletDetails } from 'ducks/wallet';
import { isGoerliTestnet } from 'helpers/networkHelper';

interface L2BannerProps {
	setCurrentPage: Function;
	walletDetails: any;
	snxBalance: number;
}
const L2Banner: React.FC<L2BannerProps> = ({ setCurrentPage, snxBalance, walletDetails }) => {
	const showBanner = isGoerliTestnet(walletDetails.networkId) && snxBalance;

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
	snxBalance: getSNXBalance(state),
	walletDetails: getWalletDetails(state),
});

const mapDispatchToProps = {
	setCurrentPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(L2Banner);
