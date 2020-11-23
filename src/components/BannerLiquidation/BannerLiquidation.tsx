import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from 'ducks/types';
import { getDebtStatusData } from 'ducks/debtStatus';

import styled from 'styled-components';

const mapStateToProps = (state: RootState) => ({
	debtStatus: getDebtStatusData(state),
});

const connector = connect(mapStateToProps, null);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Banner: FC<PropsFromRedux> = ({ debtStatus }) => {
	if (!debtStatus) return null;
	const { liquidationDeadline, liquidationDelay } = debtStatus;

	if (!liquidationDeadline) return null;

	return (
		<ContainerBanner>
			<StyledPMedium>
				Attention: your staked SNX may be liquidated if you don't bring your C-Ratio above the
				liquidation ratio within {liquidationDelay / 3600} hours. Click{' '}
				<Link href="https://blog.synthetix.io/liquidation-faqs" target="_blank">
					here
				</Link>{' '}
				for more info.
			</StyledPMedium>
		</ContainerBanner>
	);
};

const Link = styled.a`
	text-decoration: underline;
	color: white;
`;

const ContainerBanner = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 2px;
	width: 100%;
	background: ${props => props.theme.colorStyles.brandRed};
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

export default connector(Banner) as any;
