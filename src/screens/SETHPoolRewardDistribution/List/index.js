import React, { Fragment } from 'react';
import styled from 'styled-components';

import Table from '../../../components/Table';
import { ButtonPrimaryMedium } from '../../../components/Button';

import {
  useOwners,
  useRequiredConfirmationCount,
  useTransactions,
} from '../hooks';

const List = ({ setPage }) => {
  const owners = useOwners(); // eslint-disable-line
  const requiredConfirmationCount = useRequiredConfirmationCount();
  const { loading, transactions } = useTransactions();

  return (
    <Fragment>
      {loading
        ? <div>Loading...</div>
        : (
          <Column>
            <ButtonPrimaryMedium onClick={() => setPage('create')}>
              submit a new transaction
            </ButtonPrimaryMedium>
            <Table
              header={[
                { key: 'id', value: 'ID' },
                { key: 'committed', value: 'committed' },
                { key: 'signers', value: 'signers' },
                { key: 'youConfirmed', value: 'you confirmed' },
                { key: 'confirm', value: 'confirm' },
              ]}
              data={transactions.map(item => ({
                id: item.id,
                committed: new Date().toString(),
                signers: `${item.confirmationCount}/${requiredConfirmationCount}`,
                confirm: 'Confirm',
                youConfirmed: item.youConfirmed ? 'Yes' : 'No',
              }))}
            />
          </Column>
        )
      }
    </Fragment>
  );
};

const Column = styled('div')`
  display: flex;
  flex-direction: column;
`;

export default List;
