import React from 'react';
import styled from 'styled-components';
import { PMedium } from '../Typography';
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

const ContainerBanner = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 2px;
	width: 100%;
	/* @TODO: Copy over Clem's theme documents for the respective colors */
	background: linear-gradient(90deg, #0885fe, #4e3cbd);
	color: white;
	cursor: pointer;
`;

const StyledPMedium = styled(PMedium)`
	color: ${props => props.theme.colorStyles.heading};
	text-transform: uppercase;
	margin-right: 4px;
`;

const mapStateToProps = () => ({});

const mapDispatchToProps = {
	setCurrentPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(L2Banner);
