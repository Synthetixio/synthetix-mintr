import numbro from 'numbro';
import snxJSConnector from '../helpers/snxJSConnector';

export const formatCurrency = (value, decimals = 2) => {
	if (!value) return 0;
	if (!Number(value)) return 0;
	return numbro(value).format('0,0.' + '0'.repeat(decimals));
};

export const shortenAddress = address => {
	if (!address) return null;
	return address.slice(0, 6) + '...' + address.slice(-4, address.length);
};

function str_pad_left(string, pad, length) {
	return (new Array(length + 1).join(pad) + string).slice(-length);
}

export const bytesFormatter = input => snxJSConnector.ethersUtils.formatBytes32String(input);

export const bigNumberFormatter = value => Number(snxJSConnector.utils.formatEther(value));

export const bigNumberToStringFormatter = value => snxJSConnector.utils.formatEther(value);

export const getAddress = addr => snxJSConnector.ethersUtils.getAddress(addr);

export const secondsToTime = seconds => {
	const minutes = Math.floor(seconds / 60);
	const secondsLeft = seconds - minutes * 60;
	return str_pad_left(minutes, '0', 2) + ':' + str_pad_left(secondsLeft, '0', 2);
};
