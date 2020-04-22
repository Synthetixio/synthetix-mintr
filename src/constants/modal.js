import keyBy from 'lodash/keyBy';

const MODAL_TYPES = ['GWEI', 'DELEGATE'];
export const MODAL_TYPES_TO_KEY = keyBy(MODAL_TYPES);
