import keyBy from 'lodash/keyBy';

export const GAS_LIMIT_BUFFER_PERCENTAGE = 0.2;

export const GWEI_UNIT = 1000000000;

export const NETWORK_SPEEDS = ['SLOW', 'AVERAGE', 'FAST'];
export const NETWORK_SPEEDS_TO_KEY = keyBy(NETWORK_SPEEDS);

export const TOKEN_ALLOWANCE_LIMIT = 100000000;
