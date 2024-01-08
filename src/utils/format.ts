// Automatically select number of decimals based on number of decimal places.
export function autoSelectDecimals(value: number): number {
  return value < 10000
    ? value < 1000
      ? value < 100
        ? value < 10
          ? value < 1
            ? 4
            : 4
          : 3
        : 2
      : 1
    : 0;
}

// Convert number to string with decimal place separators and fixed decimals count.
export function decimalWithSeparator(value: number, decimals: number | 'auto' = 'auto', separator = ','): string {
  if (decimals === 'auto') {
    decimals = autoSelectDecimals(value);
  }

  const parts: string[] = value.toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  return parts.join('.');
}
