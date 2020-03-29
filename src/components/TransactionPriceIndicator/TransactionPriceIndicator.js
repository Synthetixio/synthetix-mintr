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

import { MODAL_TYPES_TO_KEY } from '../../constants/modal';

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
							{currentGasPrice
								? `$${formatCurrency(
										getTransactionPrice(currentGasPrice.price, gasLimit, ethRate)
								  )} / ${currentGasPrice.price} GWEI`
								: 0}
						</Subtext>
						{canEdit ? (
							<Button
								onClick={() =>
									showModal({ modalType: MODAL_TYPES_TO_KEY.GWEI, modalProps: { gasLimit } })
								}
							>
								{t('button.edit')}
							</Button>
						) : null}
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
	flex: 1;
	display: flex;
	justify-content: center;
	white-space: nowrap;
`;

const Button = styled.button`
	font-family: 'apercu-bold', sans-serif;
	border: none;
	background-color: transparent;
	font-size: 15px;
	text-transform: uppercase;
	cursor: pointer;
	color: ${props => props.theme.colorStyles.hyperlink};
	:hover {
		text-decoration: underline;
	}
`;

const mapStateToProps = state => ({
	currentGasPrice: getCurrentGasPrice(state),
	ethRate: getEthRate(state),
});

const mapDispatchToProps = {
	showModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionPriceIndicator);
