// Aukro backend API constants.
//
// Absolute URL — assumes the browser can reach aukro.cz from the current
// origin (dev proxy or deployed CORS allow-list). If that stops being
// true, move this to an environment-scoped config.

export const AUKRO_SEARCH_ENDPOINT =
  'https://aukro.cz/backend-web/api/offers/searchItemsCommon';

// Category id for "Ostatní ovoce a zelenina" — the one category we query.
export const CATEGORY_ID_FRUIT_VEG = 82947;
