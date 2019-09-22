import React, { useContext } from 'react';
import { Store } from '../../store';
import { ButtonTransactionEdit } from '../Button';
import { Subtext } from '../Typography';
import { formatCurrency } from '../../helpers/formatters';

const TransactionPriceIndicator = ({ canEdit = true }) => {
  const {
    state: {
      network: {
        settings: { gasPrice, transactionUsdPrice },
      },
    },
  } = useContext(Store);
  return (
    <Subtext marginBottom="32px">
      {`Ethereum Network Fees: $${formatCurrency(
        transactionUsdPrice
      )} (${gasPrice} GWEI)`}
      {canEdit ? <ButtonTransactionEdit></ButtonTransactionEdit> : null}
    </Subtext>
  );
};

export default TransactionPriceIndicator;
