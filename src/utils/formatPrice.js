export function formatPrice(n, currency = "PKR") {
  if (n == null || isNaN(n)) return "Price on request";
  if (n >= 10000000) return `${currency} ${(n / 10000000).toFixed(2).replace(/\.?0+$/, "")} Crore`;
  if (n >= 100000) return `${currency} ${(n / 100000).toFixed(1).replace(/\.0$/, "")} Lac`;
  return `${currency} ${Number(n).toLocaleString()}`;
}
