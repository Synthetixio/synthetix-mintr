import { getEtherscanTxLink } from 'helpers/explorers';

export function notifyHandler(notify, hash, networkId, callback, message) {
	let { emitter } = notify.hash(hash);

	const link = getEtherscanTxLink(networkId, hash);

	emitter.on('all', () => {
		return {
			link,
		};
	});

	emitter.on('txConfirmed', () => {
		setTimeout(() => {
			callback();
		}, 15000);
		return {
			message: message ? message : undefined,
			link,
			autoDismiss: false,
		};
	});
}

export function notifyNotification(notify, message, type = 'pending') {
	let notificationObject = {
		eventCode: 'notification',
		type: type,
		message: message,
	};

	return notify.notification(notificationObject);
}
