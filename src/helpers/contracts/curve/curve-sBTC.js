export default {
	address: '0x075b1bb99792c9E1041bA13afEf80C91a1e70fB3',
	abi: [
		{
			name: 'Transfer',
			inputs: [
				{ type: 'address', name: '_from', indexed: true },
				{ type: 'address', name: '_to', indexed: true },
				{ type: 'uint256', name: '_value', indexed: false },
			],
			anonymous: false,
			type: 'event',
		},
		{
			name: 'Approval',
			inputs: [
				{ type: 'address', name: '_owner', indexed: true },
				{ type: 'address', name: '_spender', indexed: true },
				{ type: 'uint256', name: '_value', indexed: false },
			],
			anonymous: false,
			type: 'event',
		},
		{
			outputs: [],
			inputs: [
				{ type: 'string', name: '_name' },
				{ type: 'string', name: '_symbol' },
				{ type: 'uint256', name: '_decimals' },
				{ type: 'uint256', name: '_supply' },
			],
			constant: false,
			payable: false,
			type: 'constructor',
		},
		{
			name: 'set_minter',
			outputs: [],
			inputs: [{ type: 'address', name: '_minter' }],
			constant: false,
			payable: false,
			type: 'function',
			gas: 36247,
		},
		{
			name: 'totalSupply',
			outputs: [{ type: 'uint256', name: 'out' }],
			inputs: [],
			constant: true,
			payable: false,
			type: 'function',
			gas: 1181,
		},
		{
			name: 'allowance',
			outputs: [{ type: 'uint256', name: 'out' }],
			inputs: [
				{ type: 'address', name: '_owner' },
				{ type: 'address', name: '_spender' },
			],
			constant: true,
			payable: false,
			type: 'function',
			gas: 1519,
		},
		{
			name: 'transfer',
			outputs: [{ type: 'bool', name: 'out' }],
			inputs: [
				{ type: 'address', name: '_to' },
				{ type: 'uint256', name: '_value' },
			],
			constant: false,
			payable: false,
			type: 'function',
			gas: 74802,
		},
		{
			name: 'transferFrom',
			outputs: [{ type: 'bool', name: 'out' }],
			inputs: [
				{ type: 'address', name: '_from' },
				{ type: 'address', name: '_to' },
				{ type: 'uint256', name: '_value' },
			],
			constant: false,
			payable: false,
			type: 'function',
			gas: 111953,
		},
		{
			name: 'approve',
			outputs: [{ type: 'bool', name: 'out' }],
			inputs: [
				{ type: 'address', name: '_spender' },
				{ type: 'uint256', name: '_value' },
			],
			constant: false,
			payable: false,
			type: 'function',
			gas: 39012,
		},
		{
			name: 'mint',
			outputs: [],
			inputs: [
				{ type: 'address', name: '_to' },
				{ type: 'uint256', name: '_value' },
			],
			constant: false,
			payable: false,
			type: 'function',
			gas: 75733,
		},
		{
			name: 'burn',
			outputs: [],
			inputs: [{ type: 'uint256', name: '_value' }],
			constant: false,
			payable: false,
			type: 'function',
			gas: 76623,
		},
		{
			name: 'burnFrom',
			outputs: [],
			inputs: [
				{ type: 'address', name: '_to' },
				{ type: 'uint256', name: '_value' },
			],
			constant: false,
			payable: false,
			type: 'function',
			gas: 76696,
		},
		{
			name: 'name',
			outputs: [{ type: 'string', name: 'out' }],
			inputs: [],
			constant: true,
			payable: false,
			type: 'function',
			gas: 7853,
		},
		{
			name: 'symbol',
			outputs: [{ type: 'string', name: 'out' }],
			inputs: [],
			constant: true,
			payable: false,
			type: 'function',
			gas: 6906,
		},
		{
			name: 'decimals',
			outputs: [{ type: 'uint256', name: 'out' }],
			inputs: [],
			constant: true,
			payable: false,
			type: 'function',
			gas: 1511,
		},
		{
			name: 'balanceOf',
			outputs: [{ type: 'uint256', name: 'out' }],
			inputs: [{ type: 'address', name: 'arg0' }],
			constant: true,
			payable: false,
			type: 'function',
			gas: 1695,
		},
	],
};
