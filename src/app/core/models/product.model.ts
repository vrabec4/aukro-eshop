import { Language } from './language.model';

export type ProductUnit = 'kg' | 'pcs' | 'bundle';

export interface ProductImages {
  thumb: string; // ~73x73, for cart rows / list thumbnails
  card: string; // ~400x300, for product card (1x density)
  full: string; // ~730x548, for detail view / srcset 2x density
}

export interface Product {
  id: string;
  name: Record<Language, string>;
  images: ProductImages;
  unit: ProductUnit;
  quantity: number;
  basePriceCzk: number;
}
