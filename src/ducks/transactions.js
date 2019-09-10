const CREATE_TRANSACTION = 'TRANSACTION/CREATE';
const HIDE_TRANSACTION = 'TRANSACTION/HIDE';
const UPDATE_SUCCESS_QUEUE = 'TRANSACTION/UPDATE_SUCCESS_QUEUE';
const CLEAR_SUCCESS_QUEUE = 'TRANSACTION/CLEAR_SUCCESS_QUEUE';

const transactionDefault = {
  isWaitingForSuccess: false,
  status: null,
  hash: null,
  balanceDataIsFetched: null,
  priceDataIsFetched: null,
  rewardDataIsFetched: null,
  debtDataIsFetched: null,
  synthDataIsFetched: null,
  hasNotification: null,
  info: null,
};

export default (state, action) => {
  switch (action.type) {
    case CREATE_TRANSACTION: {
      const transactions = state.currentTransactions;
      return {
        ...state,
        currentTransactions: [
          ...transactions,
          { ...transactionDefault, ...action.payload },
        ],
      };
    }
    case HIDE_TRANSACTION: {
      const transactions = state.currentTransactions
        .slice()
        .map(transaction => {
          if (transaction.hash !== action.payload) return transaction;
          return { ...transaction, hasNotification: false };
        });
      return {
        ...state,
        currentTransactions: transactions,
      };
    }
    case UPDATE_SUCCESS_QUEUE: {
      return {
        ...state,
        successQueue: [...state.successQueue, action.payload],
      };
    }
    case CLEAR_SUCCESS_QUEUE: {
      return {
        ...state,
        successQueue: [],
      };
    }
    default:
      return state;
  }
};

export const createTransaction = (transaction, dispatch) => {
  return dispatch({
    type: CREATE_TRANSACTION,
    payload: transaction,
  });
};

export const hideTransaction = (hash, dispatch) => {
  return dispatch({
    type: HIDE_TRANSACTION,
    payload: hash,
  });
};

export const pushToSuccessQueue = (hash, dispatch) => {
  return dispatch({
    type: UPDATE_SUCCESS_QUEUE,
    payload: hash,
  });
};

export const clearSuccessQueue = dispatch => {
  return dispatch({
    type: CLEAR_SUCCESS_QUEUE,
  });
};

// selectTransactionStatusOfFIrstCompleted () => {
//   const completedTrans = transactions.filter(completed);
//   return  completedTrasaction[0]
//     ? completedTrasaction[0].trasactionStatus
//     : null;

// }

// export const updateFetchers = (type, value, dispatch) => {
//   return dispatch({
//     type: ///,
//     payload: {type, value}
//   })

// const updateTransactionStatus
