import keyBy from 'lodash/keyBy';

export const PAGINATION_INDEX = 8;

export const TRANSACTION_EVENTS = [
	'issued',
	'burned',
	'feesClaimed',
	'exchanged',
	'cleared',
	'bought',
	'deposit',
	'withdrawl',
];

export const TRANSACTION_EVENTS_MAP = keyBy(TRANSACTION_EVENTS);
