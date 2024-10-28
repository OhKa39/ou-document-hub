export default function ToVietnameseCurrency(price: any) {
  return BigInt(price).toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
}
