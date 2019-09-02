const CREATE_TRANSACTION = 'TRANSACTION/CREATE';

export default (state, action) => {
  switch (action.type) {
    case CREATE_TRANSACTION: {
      return { ...state, current: action.payload };
    }
  }
};

export const createTransaction = (transaction, dispatch) => {
  return dispatch({
    type: CREATE_TRANSACTION,
    payload: transaction,
  });
};
