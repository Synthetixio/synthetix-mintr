import numbro from 'numbro';

export const formatCurrency = (value: number, decimals = 2) => {
  if (!value) return 0;
  return numbro(value).format('0,0.' + '0'.repeat(decimals));
};
