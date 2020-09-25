import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { useTranslation } from 'react-i18next';
import { getCurrentGasPrice } from '../../ducks/network';
import { showModal } from '../../ducks/modal';
import { getEthRate } from '../../ducks/rates';

import { Subtext } from '../Typography';
import { formatCurrency } from '../../helpers/formatters';
import { MicroSpinner } from '../Spinner';
import GasMenu from '../GasMenu';

import { getTransactionPrice } from '../../helpers/networkHelper';

const TransactionPriceIndicator = ({
	canEdit = true,
	currentGasPrice,
	isFetchingGasLimit,
	showModal,
	gasLimit,
	ethRate,
	...style
}) => {
	const { t } = useTranslation();
	return (
		<Container {...style}>
			<Block>
				<Subtext mr={'10px'}>{t('transactionSettings.priceIndicator')}</Subtext>
			</Block>
			<Block>
				{isFetchingGasLimit ? (
					<MicroSpinner />
				) : (
					<Fragment>
						<Subtext>
							{/* {currentGasPrice
								? `$${formatCurrency(
										getTransactionPrice(currentGasPrice.price, gasLimit, ethRate)
								  )} / ${currentGasPrice.price} GWEI`
								: 0} */}
							$0.00/0 GWEI
						</Subtext>
						{/* {canEdit ? <GasMenu /> : null} */}
					</Fragment>
				)}
			</Block>
		</Container>
	);
};

const Container = styled.div`
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

const mapStateToProps = state => ({
	currentGasPrice: getCurrentGasPrice(state),
	ethRate: getEthRate(state),
});

const mapDispatchToProps = {
	showModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionPriceIndicator);
