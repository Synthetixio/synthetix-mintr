import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

// import { useTranslation } from 'react-i18next';
import { getCurrentGasPrice } from '../../ducks/network';
import { showModal } from '../../ducks/modal';
import { getEthRate } from '../../ducks/rates';

import { formatCurrency } from '../../helpers/formatters';
import { NETWORK_SPEEDS_TO_KEY } from '../../constants/network';

import { MicroSpinner } from '../Spinner';
import GasMenu from './GasMenu';

import { getTransactionPrice, getNetworkSpeeds } from '../../helpers/networkHelper';
import { fontFamilies } from 'styles/themes';

const TransactionPriceIndicator = ({
	canEdit = true,
	currentGasPrice,
	isFetchingGasLimit,
	showModal,
	gasLimit,
	ethRate,
	...style
}) => {
	const [selectedSpeed, setSelectedSpeed] = useState<any>(NETWORK_SPEEDS_TO_KEY.AVERAGE);
	const [estimatedTime, setEstimatedTime] = useState<number>(0);
	// const { t } = useTranslation();
	const returnEstTime = useCallback(async () => {
		const networkSpeeds = await getNetworkSpeeds();
		switch (selectedSpeed) {
			case NETWORK_SPEEDS_TO_KEY.SLOW:
				setEstimatedTime(networkSpeeds[NETWORK_SPEEDS_TO_KEY.SLOW].time);
				break;
			case NETWORK_SPEEDS_TO_KEY.AVERAGE:
				setEstimatedTime(networkSpeeds[NETWORK_SPEEDS_TO_KEY.AVERAGE].time);
				break;
			case NETWORK_SPEEDS_TO_KEY.FAST:
				setEstimatedTime(networkSpeeds[NETWORK_SPEEDS_TO_KEY.FAST].time);
				break;
		}
	}, [selectedSpeed]);

	useEffect(() => {
		returnEstTime();
	}, [returnEstTime]);
	return (
		<Container {...style}>
			<Block>
				{isFetchingGasLimit ? (
					<MicroSpinner />
				) : (
					<GasStat>
						<StatText>
							{currentGasPrice
								? ` GAS: $${formatCurrency(
										getTransactionPrice(currentGasPrice.price, gasLimit, ethRate)
								  )} / ~ SPEED ${estimatedTime} mins`
								: 0}
						</StatText>
						<GasMenu setSelectedSpeed={setSelectedSpeed} />
					</GasStat>
				)}
			</Block>
		</Container>
	);
};

const Container = styled.div<any>`
	display: flex;
	align-items: center;
	justify-content: center;
	margin: ${props => (props.margin ? props.margin : '25px 0')};
`;

const Block = styled.div`
	display: flex;
	justify-content: center;
	white-space: nowrap;
`;

const GasStat = styled.div`
	display: flex;
	align-items: center;
`;

const StatText = styled.p`
	font-family: ${fontFamilies.regular};
	font-size: 14px;
	line-height: 24px;
	text-align: center;
	letter-spacing: 0.175px;
	color: #cacaf1;
`;

const mapStateToProps = state => ({
	currentGasPrice: getCurrentGasPrice(state),
	ethRate: getEthRate(state),
});

const mapDispatchToProps = {
	showModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionPriceIndicator);
