import { Product } from './product.model';

/**
 * Subset of Product stored inside a CartItem at add-time so cart rendering,
 * totals, and future persistence (localStorage / backend) don't depend on
 * the catalog still having the product loaded.
 */
export type ProductSnapshot = Omit<Product, 'id'>;

export interface CartItem {
  productId: string;
  quantity: number;
  snapshot: ProductSnapshot;
}
