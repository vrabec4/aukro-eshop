import { Language } from '../models/language.model';
import { ProductUnit } from '../models/product.model';

// Optional per-offerId localized name overrides. Entries here beat the raw
// Aukro API name. Empty by default — real offers fall through to apiName.
export const PRODUCT_NAMES: Record<string, Record<Language, string>> = {};

export const UNIT_LABELS: Record<Language, Record<ProductUnit, string>> = {
  cs: { kg: 'kg', pcs: 'ks', bundle: 'svazek', pack: 'balení' },
  sk: { kg: 'kg', pcs: 'ks', bundle: 'zväzok', pack: 'balenie' },
  en: { kg: 'kg', pcs: 'pcs', bundle: 'bundle', pack: 'pack' },
};

export const LANGUAGE_LOCALES: Record<Language, string> = {
  cs: 'cs-CZ',
  sk: 'sk-SK',
  en: 'en-US',
};
