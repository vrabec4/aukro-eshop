import { Language } from './language.model';

export type ProductUnit = 'kg' | 'pcs' | 'bundle';

export interface Product {
  id: string;
  name: Record<Language, string>;
  imageUrl: string;
  unit: ProductUnit;
  quantity: number;
  basePriceCzk: number;
}
