import keyBy from 'lodash/keyBy';

export const PAGINATION_INDEX = 10;

export const TRANSACTION_EVENTS = [
	'issued',
	'burned',
	'exchanged',
	'cleared',
	'deposit',
	'withdrawl',
];

export const TRANSACTION_EVENTS_MAP = keyBy(TRANSACTION_EVENTS);
