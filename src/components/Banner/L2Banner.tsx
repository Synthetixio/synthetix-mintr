import React from 'react';
import styled from 'styled-components';
import { ReactComponent as DiagonalArrow } from '../../assets/images/Banner/DiagonalArrow.svg';
import { setCurrentPage } from '../../ducks/ui';
import { PAGES_BY_KEY } from '../../constants/ui';
import { connect } from 'react-redux';

interface L2BannerProps {
	setCurrentPage: Function;
}
const L2Banner: React.FC<L2BannerProps> = ({ setCurrentPage }) => {
	return (
		<ContainerBanner onClick={() => setCurrentPage(PAGES_BY_KEY.L2ONBOARDING)}>
			<StyledPMedium>Save on gas fees by staking on l2. Click here to move to l2!</StyledPMedium>
			<DiagonalArrow />
		</ContainerBanner>
	);
};

/* Harcoded styles because it does not exist within l2 app*/
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
	font-family: 'apercu-regular';
	color: white;
	text-transform: uppercase;
	margin-right: 4px;
`;

const mapStateToProps = () => ({});

const mapDispatchToProps = {
	setCurrentPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(L2Banner);
