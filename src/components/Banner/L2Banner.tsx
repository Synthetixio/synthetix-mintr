import React from 'react';
import styled from 'styled-components';
import { ReactComponent as DiagonalArrow } from '../../assets/images/L2/DiagonalArrow.svg';
import { setCurrentPage } from '../../ducks/ui';
import { PAGES_BY_KEY } from '../../constants/ui';
import { connect } from 'react-redux';
import { fontFamilies } from 'styles/themes';

interface L2BannerProps {
	setCurrentPage: Function;
}

const L2Banner: React.FC<L2BannerProps> = ({ setCurrentPage }) => {
	return (
		<ContainerBanner onClick={() => setCurrentPage(PAGES_BY_KEY.L2ONBOARDING)}>
			<StyledPMedium>
				This wallet is eligible to participate in the Optimistic Ethereum L2 Testnet Trial - Try it
				out now and earn L2 SNX rewards!
			</StyledPMedium>
			<DiagonalArrow />
		</ContainerBanner>
	);
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

const mapDispatchToProps = {
	setCurrentPage,
};

export default connect(null, mapDispatchToProps)(L2Banner);
