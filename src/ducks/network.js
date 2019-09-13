const UPDATE_ETH_PRICE = 'NETWORK/UPDATE_ETH_PRICE';
const UPDATE_GAS_STATION = 'NETWORK/UPDATE_GAS_STATION';

// Reducer
export default (state, action) => {
  switch (action.type) {
    case UPDATE_ETH_PRICE: {
      return { ...state, ethPrice: action.payload };
    }
    case UPDATE_GAS_STATION: {
      return { ...state, gasStation: action.payload };
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

export const updateGasStation = (gasStation, dispatch) => {
  return dispatch({
    type: UPDATE_GAS_STATION,
    payload: gasStation,
  });
};
