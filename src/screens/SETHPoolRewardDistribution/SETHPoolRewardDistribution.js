import React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import Table from '../../components/Table';

import {
  useOwners,
  useRequiredConfirmationCount,
  useTransactions,
} from './hooks';

const MainContainer = () => {
  const owners = useOwners(); // eslint-disable-line
  const requiredConfirmationCount = useRequiredConfirmationCount();
  const { loading, transactions } = useTransactions(); // eslint-disable-line
  
  return (
    <MainContainerWrapper>
      {loading ? (
        <div>Loading...</div>
      ) : (
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
      )}
    </MainContainerWrapper>
  );
};

const MainContainerWrapper = styled('div')`
  width: 100%;
  background-color: ${props => props.theme.colorStyles.background};
  padding: 40px;
`;

export default withTranslation()(MainContainer);
