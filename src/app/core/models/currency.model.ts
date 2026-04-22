export type Currency = 'CZK' | 'EUR' | 'GBP';

export const CURRENCIES: readonly Currency[] = ['CZK', 'EUR', 'GBP'] as const;

export const DEFAULT_CURRENCY: Currency = 'CZK';
