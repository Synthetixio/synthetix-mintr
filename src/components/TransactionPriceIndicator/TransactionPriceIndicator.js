import React, { useContext } from 'react';
import { Store } from '../../store';
import { ButtonTransactionEdit } from '../Button';
import { Subtext } from '../Typography';
import { formatCurrency } from '../../helpers/formatters';

const TransactionPriceIndicator = () => {
  const {
    state: {
      network: {
        settings: { gasPrice, transactionUsdPrice },
      },
    },
  } = useContext(Store);
  return (
    <Subtext marginBottom="32px">
      {`NETWORK PRICE: $${formatCurrency(
        transactionUsdPrice
      )} (${gasPrice} GWEI)`}
      <ButtonTransactionEdit></ButtonTransactionEdit>
    </Subtext>
  );
};

export default TransactionPriceIndicator;
