export default {
	address: '0x5535fd021F7022f768c3A5418d3D61668F882412',
	abi: [
		{
			inputs: [
				{
					internalType: 'address',
					name: '_libAddressManager',
					type: 'address',
				},
				{
					internalType: 'uint256',
					name: '_fraudProofWindow',
					type: 'uint256',
				},
				{
					internalType: 'uint256',
					name: '_sequencerPublishWindow',
					type: 'uint256',
				},
			],
			stateMutability: 'nonpayable',
			type: 'constructor',
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: 'uint256',
					name: '_batchIndex',
					type: 'uint256',
				},
				{
					indexed: false,
					internalType: 'bytes32',
					name: '_batchRoot',
					type: 'bytes32',
				},
				{
					indexed: false,
					internalType: 'uint256',
					name: '_batchSize',
					type: 'uint256',
				},
				{
					indexed: false,
					internalType: 'uint256',
					name: '_prevTotalElements',
					type: 'uint256',
				},
				{
					indexed: false,
					internalType: 'bytes',
					name: '_extraData',
					type: 'bytes',
				},
			],
			name: 'StateBatchAppended',
			type: 'event',
		},
		{
			inputs: [],
			name: 'FRAUD_PROOF_WINDOW',
			outputs: [
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256',
				},
			],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [],
			name: 'SEQUENCER_PUBLISH_WINDOW',
			outputs: [
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256',
				},
			],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [
				{
					internalType: 'bytes32[]',
					name: '_batch',
					type: 'bytes32[]',
				},
				{
					internalType: 'uint256',
					name: '_shouldStartAtElement',
					type: 'uint256',
				},
			],
			name: 'appendStateBatch',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{
			inputs: [
				{
					internalType: 'bytes32',
					name: '_id',
					type: 'bytes32',
				},
				{
					internalType: 'uint256',
					name: '_index',
					type: 'uint256',
				},
			],
			name: 'canOverwrite',
			outputs: [
				{
					internalType: 'bool',
					name: '',
					type: 'bool',
				},
			],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [
				{
					components: [
						{
							internalType: 'uint256',
							name: 'batchIndex',
							type: 'uint256',
						},
						{
							internalType: 'bytes32',
							name: 'batchRoot',
							type: 'bytes32',
						},
						{
							internalType: 'uint256',
							name: 'batchSize',
							type: 'uint256',
						},
						{
							internalType: 'uint256',
							name: 'prevTotalElements',
							type: 'uint256',
						},
						{
							internalType: 'bytes',
							name: 'extraData',
							type: 'bytes',
						},
					],
					internalType: 'struct Lib_OVMCodec.ChainBatchHeader',
					name: '_batchHeader',
					type: 'tuple',
				},
			],
			name: 'deleteStateBatch',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{
			inputs: [],
			name: 'getLastSequencerTimestamp',
			outputs: [
				{
					internalType: 'uint256',
					name: '_lastSequencerTimestamp',
					type: 'uint256',
				},
			],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [],
			name: 'getTotalBatches',
			outputs: [
				{
					internalType: 'uint256',
					name: '_totalBatches',
					type: 'uint256',
				},
			],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [],
			name: 'getTotalElements',
			outputs: [
				{
					internalType: 'uint256',
					name: '_totalElements',
					type: 'uint256',
				},
			],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [],
			name: 'init',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{
			inputs: [
				{
					components: [
						{
							internalType: 'uint256',
							name: 'batchIndex',
							type: 'uint256',
						},
						{
							internalType: 'bytes32',
							name: 'batchRoot',
							type: 'bytes32',
						},
						{
							internalType: 'uint256',
							name: 'batchSize',
							type: 'uint256',
						},
						{
							internalType: 'uint256',
							name: 'prevTotalElements',
							type: 'uint256',
						},
						{
							internalType: 'bytes',
							name: 'extraData',
							type: 'bytes',
						},
					],
					internalType: 'struct Lib_OVMCodec.ChainBatchHeader',
					name: '_batchHeader',
					type: 'tuple',
				},
			],
			name: 'insideFraudProofWindow',
			outputs: [
				{
					internalType: 'bool',
					name: '_inside',
					type: 'bool',
				},
			],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [
				{
					internalType: 'string',
					name: '_name',
					type: 'string',
				},
			],
			name: 'resolve',
			outputs: [
				{
					internalType: 'address',
					name: '_contract',
					type: 'address',
				},
			],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [
				{
					components: [
						{
							internalType: 'uint256',
							name: 'batchIndex',
							type: 'uint256',
						},
						{
							internalType: 'bytes32',
							name: 'batchRoot',
							type: 'bytes32',
						},
						{
							internalType: 'uint256',
							name: 'batchSize',
							type: 'uint256',
						},
						{
							internalType: 'uint256',
							name: 'prevTotalElements',
							type: 'uint256',
						},
						{
							internalType: 'bytes',
							name: 'extraData',
							type: 'bytes',
						},
					],
					internalType: 'struct Lib_OVMCodec.ChainBatchHeader',
					name: '_stateBatchHeader',
					type: 'tuple',
				},
				{
					components: [
						{
							internalType: 'uint256',
							name: 'timestamp',
							type: 'uint256',
						},
						{
							internalType: 'uint256',
							name: 'blockNumber',
							type: 'uint256',
						},
						{
							internalType: 'enum Lib_OVMCodec.QueueOrigin',
							name: 'l1QueueOrigin',
							type: 'uint8',
						},
						{
							internalType: 'address',
							name: 'l1TxOrigin',
							type: 'address',
						},
						{
							internalType: 'address',
							name: 'entrypoint',
							type: 'address',
						},
						{
							internalType: 'uint256',
							name: 'gasLimit',
							type: 'uint256',
						},
						{
							internalType: 'bytes',
							name: 'data',
							type: 'bytes',
						},
					],
					internalType: 'struct Lib_OVMCodec.Transaction',
					name: '_transaction',
					type: 'tuple',
				},
				{
					components: [
						{
							internalType: 'bool',
							name: 'isSequenced',
							type: 'bool',
						},
						{
							internalType: 'uint256',
							name: 'queueIndex',
							type: 'uint256',
						},
						{
							internalType: 'uint256',
							name: 'timestamp',
							type: 'uint256',
						},
						{
							internalType: 'uint256',
							name: 'blockNumber',
							type: 'uint256',
						},
						{
							internalType: 'bytes',
							name: 'txData',
							type: 'bytes',
						},
					],
					internalType: 'struct Lib_OVMCodec.TransactionChainElement',
					name: '_txChainElement',
					type: 'tuple',
				},
				{
					components: [
						{
							internalType: 'uint256',
							name: 'batchIndex',
							type: 'uint256',
						},
						{
							internalType: 'bytes32',
							name: 'batchRoot',
							type: 'bytes32',
						},
						{
							internalType: 'uint256',
							name: 'batchSize',
							type: 'uint256',
						},
						{
							internalType: 'uint256',
							name: 'prevTotalElements',
							type: 'uint256',
						},
						{
							internalType: 'bytes',
							name: 'extraData',
							type: 'bytes',
						},
					],
					internalType: 'struct Lib_OVMCodec.ChainBatchHeader',
					name: '_txBatchHeader',
					type: 'tuple',
				},
				{
					components: [
						{
							internalType: 'uint256',
							name: 'index',
							type: 'uint256',
						},
						{
							internalType: 'bytes32[]',
							name: 'siblings',
							type: 'bytes32[]',
						},
					],
					internalType: 'struct Lib_OVMCodec.ChainInclusionProof',
					name: '_txInclusionProof',
					type: 'tuple',
				},
			],
			name: 'setLastOverwritableIndex',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{
			inputs: [
				{
					internalType: 'bytes32',
					name: '_element',
					type: 'bytes32',
				},
				{
					components: [
						{
							internalType: 'uint256',
							name: 'batchIndex',
							type: 'uint256',
						},
						{
							internalType: 'bytes32',
							name: 'batchRoot',
							type: 'bytes32',
						},
						{
							internalType: 'uint256',
							name: 'batchSize',
							type: 'uint256',
						},
						{
							internalType: 'uint256',
							name: 'prevTotalElements',
							type: 'uint256',
						},
						{
							internalType: 'bytes',
							name: 'extraData',
							type: 'bytes',
						},
					],
					internalType: 'struct Lib_OVMCodec.ChainBatchHeader',
					name: '_batchHeader',
					type: 'tuple',
				},
				{
					components: [
						{
							internalType: 'uint256',
							name: 'index',
							type: 'uint256',
						},
						{
							internalType: 'bytes32[]',
							name: 'siblings',
							type: 'bytes32[]',
						},
					],
					internalType: 'struct Lib_OVMCodec.ChainInclusionProof',
					name: '_proof',
					type: 'tuple',
				},
			],
			name: 'verifyStateCommitment',
			outputs: [
				{
					internalType: 'bool',
					name: '',
					type: 'bool',
				},
			],
			stateMutability: 'view',
			type: 'function',
		},
	],
};
