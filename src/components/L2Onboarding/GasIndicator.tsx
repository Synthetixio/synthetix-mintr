import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

// import { useTranslation } from 'react-i18next';
import { getCurrentGasPrice } from '../../ducks/network';
import { showModal } from '../../ducks/modal';
import { getEthRate } from '../../ducks/rates';

import { formatCurrency } from '../../helpers/formatters';

import { MicroSpinner } from '../Spinner';

import { getTransactionPrice } from '../../helpers/networkHelper';
import { fontFamilies } from 'styles/themes';
import GasMenu from 'components/GasMenu';

const TransactionPriceIndicator = ({
	canEdit = true,
	currentGasPrice,
	isFetchingGasLimit,
	showModal,
	gasLimit,
	ethRate,
	...style
}) => {
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
								  )} / ~ SPEED ${currentGasPrice.time} mins`
								: 0}
						</StatText>
						<GasMenu cyan={true} />
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
	margin: ${props => (props.margin ? props.margin : '25px 0 22px 0')};
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
	padding-top: 16px;
	text-align: center;
	letter-spacing: 0.175px;
	color: #cacaf1;
	margin: 0;
`;

const mapStateToProps = state => ({
	currentGasPrice: getCurrentGasPrice(state),
	ethRate: getEthRate(state),
});

const mapDispatchToProps = {
	showModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionPriceIndicator);
