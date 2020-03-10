import keyBy from 'lodash/keyBy';

export const GAS_LIMIT_BUFFER = 5000;

export const NETWORK_SPEEDS = ['SLOW', 'AVERAGE', 'FAST'];
export const NETWORK_SPEEDS_TO_KEY = keyBy(NETWORK_SPEEDS);
