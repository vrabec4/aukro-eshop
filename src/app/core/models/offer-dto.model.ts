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
}

export interface CarouselOffersResponse {
  content: OfferDto[];
}
