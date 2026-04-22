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

// Maps an Aukro offerId to localized product names. Covers the 10 synthetic
// fruit/veg entries from /assets/offers.json and the 2 live Aukro offers that
// are still active.
export const PRODUCT_NAMES: Record<string, Record<Language, string>> = {
  '90000001': { cs: 'Heirloom rajče', sk: 'Heirloom paradajka', en: 'Heirloom tomato' },
  '90000002': { cs: 'Fuji jablko', sk: 'Fuji jablko', en: 'Fuji apple' },
  '90000003': { cs: 'Banán', sk: 'Banán', en: 'Banana' },
  '90000004': { cs: 'Svazek mrkve', sk: 'Zväzok mrkvy', en: 'Carrot bunch' },
  '90000005': { cs: 'Okurka', sk: 'Uhorka', en: 'Cucumber' },
  '90000006': { cs: 'Citron', sk: 'Citrón', en: 'Lemon' },
  '90000007': { cs: 'Sladká cibule', sk: 'Sladká cibuľa', en: 'Sweet onion' },
  '90000008': { cs: 'Bio brambory', sk: 'Bio zemiaky', en: 'Organic potato' },
  '90000009': { cs: 'Červená paprika', sk: 'Červená paprika', en: 'Red pepper' },
  '90000010': { cs: 'Bio zázvor', sk: 'Bio zázvor', en: 'Organic ginger' },
  '6986190712': {
    cs: 'Jabra Sport Pace — bezdrátová sluchátka',
    sk: 'Jabra Sport Pace — bezdrôtové slúchadlá',
    en: 'Jabra Sport Pace — wireless headphones',
  },
  '7086632118': {
    cs: 'Pokémon TCG: Radiant Sneasler',
    sk: 'Pokémon TCG: Radiant Sneasler',
    en: 'Pokémon TCG: Radiant Sneasler',
  },
};

export const LANGUAGE_LOCALES: Record<Language, string> = {
  cs: 'cs-CZ',
  sk: 'sk-SK',
  en: 'en-US',
};
