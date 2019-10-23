import React, { Fragment, useContext } from 'react';
import styled from 'styled-components';
import { Store } from '../../store';
import { ButtonTransactionEdit } from '../Button';
import { Subtext } from '../Typography';
import { formatCurrency } from '../../helpers/formatters';
import { MicroSpinner } from '../Spinner';

const TransactionPriceIndicator = ({ canEdit = true, ...style }) => {
	const {
		state: {
			network: {
				settings: { gasPrice, transactionUsdPrice, isFetchingGasLimit },
			},
		},
	} = useContext(Store);
	return (
		<Container {...style}>
			<Block>
				<Subtext mr={'10px'}>Ethereum Network Fees:</Subtext>
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

export default TransactionPriceIndicator;
