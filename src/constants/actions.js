import keyBy from 'lodash/keyBy';

export const ACTIONS = ['mint', 'burn', 'claim', 'withdrawL2', 'inflate', 'close'];
export const ACTIONS_MAP = keyBy(ACTIONS);
