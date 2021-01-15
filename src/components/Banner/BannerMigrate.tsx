import React from 'react';
import styled from 'styled-components';
import { ReactComponent as DiagonalArrow } from '../../assets/images/L2/DiagonalArrow.svg';
import { setCurrentPage } from '../../ducks/ui';
import { connect } from 'react-redux';
import { fontFamilies } from 'styles/themes';
import { RootState } from 'ducks/types';
import { getSNXBalance } from 'ducks/balances';
import { getWalletDetails } from 'ducks/wallet';

const MigrateBanner: React.FC = () => {
	return (
		<ContainerBanner href="https://staking.synthetix.io" target="_blank">
			<StyledPMedium>
				Mintr will not be supported anymore and will be deprecated soon. Please migrate to the new
				staking app.
			</StyledPMedium>
			<DiagonalArrow />
		</ContainerBanner>
	);
};

const ContainerBanner = styled.a`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 2px;
	width: 100%;
	background: linear-gradient(100.67deg, #0885fe 34.26%, #4e3cbd 69.86%);
	color: white;
	cursor: pointer;
	text-decoration: none;
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

export default connect(mapStateToProps, mapDispatchToProps)(MigrateBanner);
