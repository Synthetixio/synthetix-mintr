import React, { Fragment } from 'react';
import styled from 'styled-components';

import Table from '../../components/Table';
import { ButtonPrimaryMedium } from '../../components/Button';

import {
  useOwners,
  useRequiredConfirmationCount,
  useTransactions,
} from './hooks';

const List = ({ setPage, openDetails }) => {
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
              data={transactions.map(item => {
                const showButton = !item.youConfirmed && item.confirmationCount < requiredConfirmationCount;
                return {
                  id: item.id,
                  committed: new Date().toString(),
                  signers: `${item.confirmationCount}/${requiredConfirmationCount}`,
                  confirm: showButton ? <ConfirmButton onClick={() => openDetails(item)}>Confirm</ConfirmButton> : null,
                  youConfirmed: item.youConfirmed ? 'Yes' : 'No',
                };
              })}
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

const ConfirmButton = styled('a')`
  cursor: pointer;
  color: #727CFF;
  underline: none;
  text-transform: uppercase;
  &:hover {
    color: #5A66F8;
  }
`;

export default List;
