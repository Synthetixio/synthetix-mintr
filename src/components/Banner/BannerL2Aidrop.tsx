import React, { FC } from 'react';
import styled from 'styled-components';
import { ReactComponent as DiagonalArrow } from '../../assets/images/diagonal-arrow.svg';

const L2Banner: FC = () => {
	return (
		<Link href="https://l2.mintr.synthetix.io" target="_blank" rel="noopener noreferrer">
			<ContainerBanner>
				<StyledPMedium>
					This wallet is eligible to participate in the Optimistic Ethereum L2 testnet trial — try
					it out now and earn L2 SNX rewards!
				</StyledPMedium>
				<DiagonalArrow />
			</ContainerBanner>
		</Link>
	);
};

const Link = styled.a`
	text-decoration: none;
`;

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
	color: white;
	text-transform: uppercase;
	margin-right: 4px;
`;

export default L2Banner;
