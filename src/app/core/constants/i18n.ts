import { Language } from '../models/language.model';

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
  | 'openBasket';

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
  },
};

// Maps an Aukro offerId to localized product names. Populated in Phase 5
// when offers.json and the real+synthetic catalog is finalized.
export const PRODUCT_NAMES: Record<string, Record<Language, string>> = {};

export const LANGUAGE_LOCALES: Record<Language, string> = {
  cs: 'cs-CZ',
  sk: 'sk-SK',
  en: 'en-US',
};
