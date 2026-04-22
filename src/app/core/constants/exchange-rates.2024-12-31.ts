import { Currency } from '../models/currency.model';

export const EXCHANGE_RATES_DATE = '2024-12-31';

// Source: ČNB kurzovní lístek 31.12.2024.
// 1 EUR = 25.185 CZK, 1 GBP = 30.378 CZK.
// Multiplier from CZK -> target currency.
export const EXCHANGE_RATES_CZK_TO: Record<Currency, number> = {
  CZK: 1,
  EUR: 1 / 25.185,
  GBP: 1 / 30.378,
};

export function convertFromCzk(amountCzk: number, target: Currency): number {
  return amountCzk * EXCHANGE_RATES_CZK_TO[target];
}
