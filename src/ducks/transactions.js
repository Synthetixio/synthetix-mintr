const CREATE_TRANSACTION = 'TRANSACTION/CREATE';
const HIDE_TRANSACTION = 'TRANSACTION/HIDE';

const defaultState = {
	isWaitingForSuccess: false,
	status: null,
	hash: null,
	balanceDataIsFetched: null,
	priceDataIsFetched: null,
	rewardDataIsFetched: null,
	debtDataIsFetched: null,
	synthDataIsFetched: null,
	hasNotification: null,
	info: null,
	currentTransactions: [],
	dataFetchers: {},
};

export default (state = defaultState, action) => {
	switch (action.type) {
		case CREATE_TRANSACTION: {
			const transactions = state.currentTransactions;
			return {
				...state,
				currentTransactions: [...transactions, { ...defaultState, ...action.payload }],
			};
		}
		case HIDE_TRANSACTION: {
			const transactions = state.currentTransactions.slice().map(transaction => {
				if (transaction.hash !== action.payload) return transaction;
				return { ...transaction, hasNotification: false };
			});
			return {
				...state,
				currentTransactions: transactions,
			};
		}
		default:
			return state;
	}
};

export const createTransaction = transaction => {
	return {
		type: CREATE_TRANSACTION,
		payload: transaction,
	};
};

export const hideTransaction = hash => {
	return {
		type: HIDE_TRANSACTION,
		payload: hash,
	};
};

export const getCurrentTransactions = state => state.transactions.currentTransactions;
