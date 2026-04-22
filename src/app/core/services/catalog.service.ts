import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly _products = signal<Product[]>([]);

  readonly products = this._products.asReadonly();

  readonly byId = computed(() => {
    const map = new Map<string, Product>();
    for (const product of this._products()) {
      map.set(product.id, product);
    }
    return map;
  });

  productById(id: string): Product | undefined {
    return this.byId().get(id);
  }

  setProducts(products: Product[]): void {
    this._products.set(products);
  }
}
