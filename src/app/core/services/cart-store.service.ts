import { computed, Injectable, signal } from '@angular/core';
import { SHIPPING_CZK, TAX_RATE } from '../constants/cart-fees';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

export interface CartLine {
  item: CartItem;
  product: Product;
  lineTotalCzk: number;
}

@Injectable({ providedIn: 'root' })
export class CartStoreService {
  private readonly _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();

  readonly count = computed(() => this._items().length);

  readonly lines = computed<CartLine[]>(() =>
    this._items()
      .filter((item) => item.snapshot.quantity > 0)
      .map((item) => {
        const product: Product = { id: item.productId, ...item.snapshot };
        const pricePerUnit = product.basePriceCzk / product.quantity;
        return {
          item,
          product,
          lineTotalCzk: pricePerUnit * item.quantity,
        };
      }),
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

  add(product: Product, amount: number): void {
    if (amount <= 0) return;
    const { id: productId, ...snapshot } = product;
    const items = this._items();
    const idx = items.findIndex((it) => it.productId === productId);
    if (idx >= 0) {
      const updated = [...items];
      updated[idx] = {
        ...updated[idx],
        quantity: updated[idx].quantity + amount,
        snapshot, // refresh snapshot to the latest known product data
      };
      this._items.set(updated);
    } else {
      this._items.set([...items, { productId, quantity: amount, snapshot }]);
    }
  }

  remove(productId: string): void {
    this._items.set(this._items().filter((it) => it.productId !== productId));
  }

  clear(): void {
    this._items.set([]);
  }
}
