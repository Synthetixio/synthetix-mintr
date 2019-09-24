import { getTransactionPrice } from '../helpers/networkHelper';

const UPDATE_ETH_PRICE = 'NETWORK/UPDATE_ETH_PRICE';
const UPDATE_INFO = 'NETWORK/UPDATE_INFO';
const UPDATE_GAS_LIMIT = 'NETWORK/UPDATE_GAS_LIMIT';
const UPDATE_GAS_PRICE = 'NETWORK/UPDATE_GAS_PRICE';
const FETCHING_GAS_LIMIT = 'NETWORK/FETCHING_GAS_LIMIT';

const GAS_LIMIT_BUFFER = 10000;

// Reducer
export default (state, action) => {
  switch (action.type) {
    case UPDATE_ETH_PRICE: {
      const { gasPrice, gasLimit } = state.settings;
      const ethPrice = action.payload;
      const transactionUsdPrice = getTransactionPrice(
        gasPrice,
        gasLimit,
        ethPrice
      );
      return {
        ...state,
        ethPrice,
        settings: { ...state.settings, transactionUsdPrice },
      };
    }
    case UPDATE_INFO: {
      const { gasStation, ethPrice } = action.payload;
      return {
        ...state,
        gasStation,
        ethPrice,
        settings: { gasPrice: gasStation['slow'].gwei },
      };
    }
    case FETCHING_GAS_LIMIT: {
      return {
        ...state,
        settings: {
          ...state.settings,
          isFetchingGasLimit: true,
          transactionUsdPrice: null,
          gasLimit: null,
        },
      };
    }
    case UPDATE_GAS_LIMIT: {
      const {
        ethPrice,
        settings: { gasPrice },
      } = state;
      const gasLimit = action.payload + GAS_LIMIT_BUFFER;
      const transactionUsdPrice = getTransactionPrice(
        gasPrice,
        gasLimit,
        ethPrice
      );
      return {
        ...state,
        settings: {
          ...state.settings,
          gasLimit: action.payload,
          transactionUsdPrice,
          isFetchingGasLimit: false,
        },
      };
    }
    case UPDATE_GAS_PRICE: {
      const {
        ethPrice,
        settings: { gasLimit },
      } = state;
      const gasPrice = action.payload;
      const transactionUsdPrice = getTransactionPrice(
        gasPrice,
        gasLimit,
        ethPrice
      );
      return {
        ...state,
        settings: {
          ...state.settings,
          gasPrice: action.payload,
          transactionUsdPrice,
        },
      };
    }
    default:
      return state;
  }
};

// Actions
export const updateEthPrice = (price, dispatch) => {
  return dispatch({
    type: UPDATE_ETH_PRICE,
    payload: price,
  });
};

export const updateNetworkInfo = (gasStation, ethPrice, dispatch) => {
  return dispatch({
    type: UPDATE_INFO,
    payload: { gasStation, ethPrice },
  });
};

export const updateGasLimit = (gasLimit, dispatch) => {
  return dispatch({
    type: UPDATE_GAS_LIMIT,
    payload: gasLimit,
  });
};

export const updateGasPrice = (gasPrice, dispatch) => {
  return dispatch({
    type: UPDATE_GAS_PRICE,
    payload: gasPrice,
  });
};

export const fetchingGasLimit = dispatch => {
  return dispatch({
    type: FETCHING_GAS_LIMIT,
  });
};
