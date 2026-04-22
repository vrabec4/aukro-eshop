import { computed, inject, Injectable, signal } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { CatalogService } from './catalog.service';

export interface CartLine {
  item: CartItem;
  product: Product;
  lineTotalCzk: number;
}

@Injectable({ providedIn: 'root' })
export class CartStoreService {
  private readonly catalog = inject(CatalogService);

  private readonly _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();

  readonly count = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0),
  );

  readonly lines = computed<CartLine[]>(() =>
    this._items()
      .map((item) => {
        const product = this.catalog.productById(item.productId);
        return product
          ? { item, product, lineTotalCzk: product.basePriceCzk * item.quantity }
          : null;
      })
      .filter((line): line is CartLine => line !== null),
  );

  readonly subtotalCzk = computed(() =>
    this.lines().reduce((sum, line) => sum + line.lineTotalCzk, 0),
  );

  add(productId: string, quantity = 1): void {
    if (quantity <= 0) {
      return;
    }
    const items = this._items();
    const idx = items.findIndex((it) => it.productId === productId);
    if (idx >= 0) {
      const updated = [...items];
      updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + quantity };
      this._items.set(updated);
    } else {
      this._items.set([...items, { productId, quantity }]);
    }
  }

  remove(productId: string): void {
    this._items.set(this._items().filter((it) => it.productId !== productId));
  }

  increment(productId: string): void {
    this.updateQuantity(productId, (q) => q + 1);
  }

  decrement(productId: string): void {
    this.updateQuantity(productId, (q) => q - 1, true);
  }

  clear(): void {
    this._items.set([]);
  }

  private updateQuantity(
    productId: string,
    mut: (q: number) => number,
    removeIfZero = false,
  ): void {
    const next = this._items()
      .map((it) => (it.productId === productId ? { ...it, quantity: mut(it.quantity) } : it))
      .filter((it) => (removeIfZero ? it.quantity > 0 : true));
    this._items.set(next);
  }
}
