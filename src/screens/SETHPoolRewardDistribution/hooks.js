import { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';

import snxJSConnector from '../../helpers/snxJSConnector';
import { Store } from '../../store';

import MultisigABI from './contracts/ABIs/multisig.json';
import AirdropperABI from './contracts/ABIs/airdropper.json';
import addresses from './contracts/addresses.json';

export function getMultisig() {
  return new ethers.Contract(addresses.multisig, MultisigABI, snxJSConnector.provider);
}

export function getAirdropper() {
  return new ethers.utils.Interface(AirdropperABI);
}

export const useOwners = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    async function getOwners() {
      const multisig = getMultisig();
      let owners = await multisig.getOwners();
      owners = owners.map(item => item.toLowerCase());
      setData(owners);
    }
    getOwners();
  }, []);
  return data;
}

export const useRequiredConfirmationCount = () => {
  const [data, setData] = useState({});
  useEffect(() => {
    async function getRequiredConfirmationCount() {
      const multisig = getMultisig();
      const requiredConfirmationCount = Number(await multisig.required());
      setData(requiredConfirmationCount);
    }
    getRequiredConfirmationCount();
  }, []);
  return data;
}

export const useTransactions = () => {
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [completedTransactions, setCompletedTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { state } = useContext(Store);
  useEffect(() => {
    async function getTransactions() {
      const multisig = getMultisig();
      const transactionCount = Number(await multisig.transactionCount());
      let transactions = await Promise.all(
        [...Array(transactionCount)].map(async (item, index) => {
          const id = index;
          const data = await Promise.all([
            multisig.transactions(id),
            multisig.getConfirmationCount(id),
            multisig.confirmations(id, state.wallet.currentWallet),
          ]);
          return {
            id,
            confirmationCount: Number(data[1]),
            youConfirmed: data[2],
            ...data[0],
          };
        })
      );
      transactions = transactions.filter(item =>
        item.destination.toLowerCase() === addresses.airdropper.toLowerCase()
      ).sort((a, b) => b.id - a.id);

      async function addTransactionsData(transactions, eventType) {
        let events = await snxJSConnector.provider.getLogs({
          fromBlock: 0,
          toBlock: 'latest',
          address: multisig.address,
          topics: [multisig.interface.events[eventType].topic],
        });
        events = await Promise.all(events.map(async item => {
          const block = await snxJSConnector.provider.getBlock(item.blockNumber)
          return {
            ...item,
            multisigTransactionId: multisig.interface.parseLog(item).values.transactionId.toNumber(),
            date: new Date(block.timestamp * 1000),
          };
        }));
        return transactions.map(item => {
          const event = events.find(e => e.multisigTransactionId === item.id);
          return {
            ...item,
            transactionHash: event.transactionHash,
            date: event.date,
          }
        })
      }

      const pending = await addTransactionsData(transactions.filter(item => !item.executed), 'Submission');
      const completed = await addTransactionsData(transactions.filter(item => item.executed), 'Execution');

      setPendingTransactions(pending);
      setCompletedTransactions(completed);
      setLoading(false);
    }
    getTransactions();
  }, [state.wallet.currentWallet]);
  return { loading, pendingTransactions, completedTransactions };
}

