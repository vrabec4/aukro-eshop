// Pinned from assignment PDF. 12 of 14 are expired as of 2026-04; the live
// API currently returns only 6986190712 and 7086632118. The merge pipeline
// supplements with fruit/veg entries from /assets/offers.json.
export const LIVE_OFFER_IDS: readonly string[] = [
  '7076190539',
  '7087376758',
  '7087202839',
  '7079604952',
  '7086686044',
  '7086829246',
  '7086469857',
  '7086405806',
  '7086269719',
  '6986190712',
  '7086708273',
  '7086632118',
  '7086307306',
  '7086406787',
] as const;

export const AUKRO_OFFERS_ENDPOINT =
  'https://aukro.cz/backend-web/api/offers/carouselOffers';

export const LOCAL_OFFERS_PATH = '/offers.json';
