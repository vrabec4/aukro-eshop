import { ProductUnit } from './product.model';

export interface OfferPrice {
  amount: number;
  currency: string;
}

export interface OfferImageRef {
  url: string;
  titleImage: boolean;
  position?: number;
}

export interface OfferImageLists {
  small?: OfferImageRef[];
  medium?: OfferImageRef[];
  medium_preview?: OfferImageRef[];
  large?: OfferImageRef[];
  original?: OfferImageRef[];
}

export interface OfferDto {
  id: number;
  name: string;
  buyNowPrice?: OfferPrice;
  biddingPrice?: OfferPrice;
  images?: { lists?: OfferImageLists };

  // Local-fallback extras. Not present on live Aukro responses; defaults applied in mapping.
  unit?: ProductUnit;
  quantity?: number;
}

export interface CarouselOffersResponse {
  content: OfferDto[];
}

// --- searchItemsCommon ---------------------------------------------------
// Listing endpoint used by the Aukro category pages. Returns a page slice
// with a different item shape than carouselOffers.

export interface SearchItemDto {
  itemId: number;
  itemName: string;
  buyNowPrice?: OfferPrice;
  price?: OfferPrice;
  priceWithShipping?: OfferPrice;
  titleImage?: { url: string };
  titleImageUrl?: string;
  quantity?: number;
  quantityType?: 'pieces' | 'sets' | string;
  seoUrl?: string;
  itemState?: string;
  buyNowActive?: boolean;
}

export interface SearchItemsPage {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number; // current page, 0-indexed
}

export interface SearchItemsResponse {
  content: SearchItemDto[];
  page: SearchItemsPage;
}
