import React, { useContext, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

import snxJSConnector from '../../helpers/snxJSConnector';
import { Store } from '../../store';
import { hideTransaction } from '../../ducks/transactions';

import { ButtonTertiary } from '../Button';
import { NotificationSpinner } from '../Spinner';
import { PMedium } from '../Typography';

import { pushToSuccessQueue } from '../../ducks/transactions';

const StatusImage = ({ status }) => {
  if (status === 'pending') {
    return <NotificationSpinner isSmall={true}></NotificationSpinner>;
  } else
    return (
      <StatusImageWrapper src={'/images/success.svg'}></StatusImageWrapper>
    );
};

const getStatusSentence = status => {
  switch (status) {
    case 'pending':
    default:
      return 'Transaction in progress';
    case 'success':
      return 'Transaction complete!';
    case 'error':
      return 'An error occurred...';
  }
};

const useGetTransactionTicket = transaction => {
  const [data, setData] = useState(transaction.status);
  const { dispatch } = useContext(Store);
  useEffect(() => {
    const getTransactionTicket = async () => {
      const status = await snxJSConnector.utils.waitForTransaction(
        transaction.hash
      );
      setData(status ? 'success' : 'error');
      if (status) {
        setTimeout(() => {
          pushToSuccessQueue(transaction.hash, dispatch);
        }, 8000);
      }
      return () => setData(null);
    };
    getTransactionTicket();
  }, []);
  return data;
};

const Notification = ({ transaction }) => {
  const {
    state: {
      wallet: { networkName },
      transactions: { successQueue },
    },
    dispatch,
  } = useContext(Store);
  const status = useGetTransactionTicket(transaction, successQueue);
  return (
    <NotificationWrapper>
      <StatusImage status={status}></StatusImage>
      <InfoBlock>
        <NotificationStatus>{getStatusSentence(status)}</NotificationStatus>
        <NotificationInfo>{transaction.info}</NotificationInfo>
      </InfoBlock>
      <ButtonBlock>
        <ButtonTertiary
          href={`https://${
            networkName === 'mainnet' ? '' : networkName + '.'
          }etherscan.io/tx/${transaction.hash}`}
          as="a"
          target="_blank"
        >
          Verify
        </ButtonTertiary>
        <ButtonTertiary
          onClick={() => hideTransaction(transaction.hash, dispatch)}
        >
          Close this window
        </ButtonTertiary>
      </ButtonBlock>
    </NotificationWrapper>
  );
};

const NotificationCenter = () => {
  const {
    state: {
      transactions: { currentTransactions },
    },
  } = useContext(Store);
  if (!currentTransactions) return null;
  return (
    <NotificationCenterWrapper>
      {currentTransactions.reverse().map(transaction => {
        if (transaction.hasNotification) {
          return (
            <Notification
              key={transaction.hash}
              transaction={transaction}
            ></Notification>
          );
        }
        return null;
      })}
    </NotificationCenterWrapper>
  );
};

const NotificationCenterWrapper = styled.div`
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 100;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const NotificationWrapper = styled.div`
  animation: ${fadeIn} 1s linear both;
  width: 560px;
  height: 72px;
  background-color: ${props => props.theme.colorStyles.panels};
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-radius: 5px;
  box-shadow: 0 4px 11px -3px #a59fb7;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

const StatusImageWrapper = styled.img`
  width: 40px;
  height: 40px;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const NotificationStatus = styled(PMedium)`
  font-family: ${props => props.theme.fontFamilies.medium};
  line-height: 5px;
  letter-spacing: 0.44px;
  margin-top: 0;
`;

const NotificationInfo = styled.p`
  font-family: ${props => props.theme.fontFamilies.medium};
  font-size: 12px;
  color: ${props => props.theme.colorStyles.tableBody};
  letter-spacing: 0.15px;
  margin: 0;
`;

const ButtonBlock = styled.div`
  display: flex;
  & > :last-child {
    margin-left: 20px;
  }
`;

export default NotificationCenter;
