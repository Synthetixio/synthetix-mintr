import keyBy from 'lodash/keyBy';

export const ACTIONS = ['mint', 'burn', 'claim', 'close', 'withdrawL2'];
export const ACTIONS_MAP = keyBy(ACTIONS);
