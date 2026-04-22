import { computed, inject, Injectable, signal } from '@angular/core';
import { SHIPPING_CZK, TAX_RATE } from '../constants/cart-fees';
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

  readonly count = computed(() => this._items().length);

  readonly lines = computed<CartLine[]>(() =>
    this._items()
      .map((item) => {
        const product = this.catalog.productById(item.productId);
        if (!product || product.quantity <= 0) return null;
        const pricePerUnit = product.basePriceCzk / product.quantity;
        return {
          item,
          product,
          lineTotalCzk: pricePerUnit * item.quantity,
        };
      })
      .filter((line): line is CartLine => line !== null),
  );

  readonly subtotalCzk = computed(() =>
    this.lines().reduce((sum, line) => sum + line.lineTotalCzk, 0),
  );

  readonly shippingCzk = computed(() =>
    this._items().length === 0 ? 0 : SHIPPING_CZK,
  );

  readonly taxCzk = computed(() => this.subtotalCzk() * TAX_RATE);

  readonly totalCzk = computed(
    () => this.subtotalCzk() + this.shippingCzk() + this.taxCzk(),
  );

  /**
   * Add a given amount (in product units, e.g. kg/pcs/bundle) to the cart.
   * If the product is already in the cart, the amounts are summed.
   */
  add(productId: string, amount: number): void {
    if (amount <= 0) return;
    const items = this._items();
    const idx = items.findIndex((it) => it.productId === productId);
    if (idx >= 0) {
      const updated = [...items];
      updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + amount };
      this._items.set(updated);
    } else {
      this._items.set([...items, { productId, quantity: amount }]);
    }
  }

  remove(productId: string): void {
    this._items.set(this._items().filter((it) => it.productId !== productId));
  }

  clear(): void {
    this._items.set([]);
  }
}
