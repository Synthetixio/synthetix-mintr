const UPDATE_WALLET_STATUS = 'WALLET/UPDATE_WALLET_STATUS';

// Reducer
export default (state, action) => {
  switch (action.type) {
    case UPDATE_WALLET_STATUS: {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
};

// Actions
export const updateWalletStatus = (walletStatus, dispatch) => {
  return dispatch({
    type: UPDATE_WALLET_STATUS,
    payload: walletStatus,
  });
};
