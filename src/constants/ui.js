import keyBy from 'lodash/keyBy';

const PAGES = ['LANDING', 'WALLET_SELECTION', 'MAIN'];
export const PAGES_BY_KEY = keyBy(PAGES);
