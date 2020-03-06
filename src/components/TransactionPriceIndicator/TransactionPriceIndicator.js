import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { useTranslation } from 'react-i18next';
import { getNetworkSettings } from '../../ducks/network';

import { ButtonTransactionEdit } from '../Button';
import { Subtext } from '../Typography';
import { formatCurrency } from '../../helpers/formatters';
import { MicroSpinner } from '../Spinner';

const TransactionPriceIndicator = ({ canEdit = true, networkSettings, ...style }) => {
	const { t } = useTranslation();
	const { gasPrice, transactionUsdPrice, isFetchingGasLimit } = networkSettings;

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
						<Subtext>{`$${formatCurrency(transactionUsdPrice)} / ${gasPrice} GWEI`}</Subtext>
						{canEdit ? <ButtonTransactionEdit></ButtonTransactionEdit> : null}
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

const mapStateToProps = state => ({
	networkSettings: getNetworkSettings(state),
});

export default connect(mapStateToProps, {})(TransactionPriceIndicator);
