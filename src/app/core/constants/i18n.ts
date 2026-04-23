import { Language } from '../models/language.model';
import { ProductUnit } from '../models/product.model';

export type UiKey =
  | 'shopList'
  | 'basket'
  | 'language'
  | 'currency'
  | 'shopTitle'
  | 'basketTitle'
  | 'itemsSuffix'
  | 'addToBasket'
  | 'remove'
  | 'orderSummary'
  | 'subtotal'
  | 'shipping'
  | 'tax'
  | 'total'
  | 'emptyShop'
  | 'emptyCart'
  | 'loading'
  | 'error'
  | 'openBasket'
  | 'placeOrder'
  | 'summaryHint'
  | 'previous'
  | 'next'
  | 'perPage'
  | 'amount'
  | 'addedToBasket'
  | 'dismiss'
  | 'increaseAmount'
  | 'decreaseAmount';

export const UI_LABELS: Record<Language, Record<UiKey, string>> = {
  cs: {
    shopList: 'Seznam produktů',
    basket: 'Košík',
    language: 'Jazyk',
    currency: 'Měna',
    shopTitle: 'Seznam produktů',
    basketTitle: 'Košík',
    itemsSuffix: 'položek',
    addToBasket: 'Přidat do košíku',
    remove: 'Odebrat',
    orderSummary: 'Souhrn objednávky',
    subtotal: 'Mezisoučet',
    shipping: 'Doprava',
    tax: 'DPH',
    total: 'Celkem',
    emptyShop: 'Žádné produkty nejsou k dispozici.',
    emptyCart: 'Košík je prázdný.',
    loading: 'Načítání…',
    error: 'Nepodařilo se načíst data.',
    openBasket: 'Otevřít košík',
    placeOrder: 'Dokončit objednávku',
    summaryHint: 'Zkontrolujte souhrn a pokračujte k objednávce.',
    previous: 'Předchozí',
    next: 'Další',
    perPage: 'Na stránku',
    amount: 'Množství',
    addedToBasket: 'Přidáno do košíku',
    dismiss: 'Zavřít',
    increaseAmount: 'Zvýšit množství',
    decreaseAmount: 'Snížit množství',
  },
  sk: {
    shopList: 'Zoznam produktov',
    basket: 'Košík',
    language: 'Jazyk',
    currency: 'Mena',
    shopTitle: 'Zoznam produktov',
    basketTitle: 'Košík',
    itemsSuffix: 'položiek',
    addToBasket: 'Pridať do košíka',
    remove: 'Odstrániť',
    orderSummary: 'Súhrn objednávky',
    subtotal: 'Medzisúčet',
    shipping: 'Doprava',
    tax: 'DPH',
    total: 'Spolu',
    emptyShop: 'Žiadne produkty nie sú k dispozícii.',
    emptyCart: 'Košík je prázdny.',
    loading: 'Načítavam…',
    error: 'Nepodarilo sa načítať dáta.',
    openBasket: 'Otvoriť košík',
    placeOrder: 'Dokončiť objednávku',
    summaryHint: 'Skontrolujte súhrn a pokračujte k objednávke.',
    previous: 'Predchádzajúca',
    next: 'Ďalšia',
    perPage: 'Na stránku',
    amount: 'Množstvo',
    addedToBasket: 'Pridané do košíka',
    dismiss: 'Zavrieť',
    increaseAmount: 'Zvýšiť množstvo',
    decreaseAmount: 'Znížiť množstvo',
  },
  en: {
    shopList: 'Shop list',
    basket: 'Basket',
    language: 'Language',
    currency: 'Currency',
    shopTitle: 'Shoplist',
    basketTitle: 'Basket',
    itemsSuffix: 'items',
    addToBasket: 'Add to basket',
    remove: 'Remove',
    orderSummary: 'Order summary',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    tax: 'Tax',
    total: 'Total',
    emptyShop: 'No products available.',
    emptyCart: 'Your basket is empty.',
    loading: 'Loading…',
    error: 'Failed to load data.',
    openBasket: 'Open basket',
    placeOrder: 'Place order',
    summaryHint: 'Review the summary before completing your order.',
    previous: 'Previous',
    next: 'Next',
    perPage: 'Per page',
    amount: 'Quantity',
    addedToBasket: 'Added to basket',
    dismiss: 'Dismiss',
    increaseAmount: 'Increase quantity',
    decreaseAmount: 'Decrease quantity',
  },
};

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
