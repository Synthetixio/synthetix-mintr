import React, { Fragment, useContext } from 'react';
import styled from 'styled-components';

import { Store } from '../../store';

import Table from '../../components/Table';
import { PageTitle, ButtonPrimaryLabel, PLarge, H5 } from '../../components/Typography';

import {
  useOwners,
  useRequiredConfirmationCount,
  useTransactions,
} from './hooks';

const List = ({ setPage, openDetails }) => {
  const {
    state: {
      wallet: { currentWallet },
    },
  } = useContext(Store);
  const owners = useOwners();
  const requiredConfirmationCount = useRequiredConfirmationCount();
  const { loading, transactions } = useTransactions();

  const isOwner = owners.includes(currentWallet.toLowerCase());

  return (
    <Fragment>
      {loading
        ? <div>Loading...</div>
        : (
          <Column>
            <PageTitle fontSize={32} marginBottom={0} marginTop={20}>
              sETH Pool Reward Distribution
            </PageTitle>
            <SubtitleContainer>
              <PLarge>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              </PLarge>
            </SubtitleContainer>
            <Button onClick={() => setPage('create')} disabled={!isOwner}>
              <ButtonPrimaryLabel>submit a new transaction</ButtonPrimaryLabel>
            </Button>
            <LabelContainer>
              <H5>Transactions:</H5>
            </LabelContainer>
            <Table
              header={[
                { key: 'id', value: 'ID' },
                { key: 'committed', value: 'committed' },
                { key: 'signers', value: 'signers' },
                { key: 'confirm', value: 'confirm' },
              ]}
              data={transactions.map(item => {
                const disabled = !isOwner || item.youConfirmed || item.confirmationCount >= requiredConfirmationCount;
                return {
                  id: item.id,
                  committed: new Date().toString(),
                  signers: `${item.confirmationCount}/${requiredConfirmationCount}`,
                  confirm: (
                    <ConfirmButton onClick={() => openDetails(item)} disabled={disabled}>Confirm</ConfirmButton>
                  ),
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
  align-items: center;
  background: ${props => props.theme.colorStyles.panels};
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-radius: ${props => (props.curved ? '40px' : '5px')};
  padding: 50px;
`;

const Button = styled.button`
  width: 540px;
  height: 64px;
  border-radius: 5px;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  background-color: ${props => props.theme.colorStyles.buttonPrimaryBg};
  transition: all ease-in 0.1s;
  &:hover {
    background-color: ${props => props.theme.colorStyles.buttonPrimaryBgFocus};
  }
  margin-bottom: 50px;
  &:disabled {
    background-color: ${props => props.theme.colorStyles.buttonPrimaryBgDisabled};
    cursor: default;
  }
`;

const ConfirmButton = styled('button')`
  cursor: pointer;
  color: #727CFF;
  underline: none;
  text-transform: uppercase;
  padding: 0;
  border: none;
  font-size: 12px;
  &:hover {
    color: #5A66F8;
  }
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const SubtitleContainer = styled.div`
  width: 500px;
  text-align: center;
  margin: 15px 0;
`;

const LabelContainer = styled.div`
  width: 100%;
`;

export default List;
