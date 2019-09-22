import numbro from 'numbro';
import snxJSConnector from '../helpers/snxJSConnector';

export const formatCurrency = (value, decimals = 2) => {
  if (!value) return 0;
  return numbro(value).format('0,0.' + '0'.repeat(decimals));
};

export const shortenAddress = address => {
  if (!address) return null;
  return address.slice(0, 6) + '...' + address.slice(-4, address.length);
};

export const bytesFormatter = input => {
  return snxJSConnector.snxJS.network === 'kovan'
    ? snxJSConnector.ethersUtils.formatBytes32String(input)
    : snxJSConnector.utils.toUtf8Bytes4(input);
};

export const bigNumberFormatter = value =>
  Number(snxJSConnector.utils.formatEther(value));
