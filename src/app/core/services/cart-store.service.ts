import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { SHIPPING_CZK, TAX_RATE } from '../constants/cart-fees';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

const STORAGE_KEY = 'aukro-eshop:cart:v1';

export interface CartLine {
  item: CartItem;
  product: Product;
  lineTotalCzk: number;
}

interface CartState {
  items: CartItem[];
}

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState<CartState>(() => ({ items: loadCartFromStorage() })),
  withComputed(({ items }) => {
    const count = computed(() => items().length);
    const lines = computed<CartLine[]>(() =>
      items()
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
    const subtotalCzk = computed(() =>
      lines().reduce((sum, line) => sum + line.lineTotalCzk, 0),
    );
    const shippingCzk = computed(() =>
      items().length === 0 ? 0 : SHIPPING_CZK,
    );
    const taxCzk = computed(() => subtotalCzk() * TAX_RATE);
    const totalCzk = computed(
      () => subtotalCzk() + shippingCzk() + taxCzk(),
    );
    return { count, lines, subtotalCzk, shippingCzk, taxCzk, totalCzk };
  }),
  withMethods((store) => ({
    add(product: Product, amount: number): void {
      if (amount <= 0) return;
      const { id: productId, ...snapshot } = product;
      const items = store.items();
      const idx = items.findIndex((it) => it.productId === productId);
      if (idx >= 0) {
        const updated = [...items];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + amount,
          snapshot, // refresh snapshot to the latest known product data
        };
        patchState(store, { items: updated });
      } else {
        patchState(store, {
          items: [...items, { productId, quantity: amount, snapshot }],
        });
      }
      saveCartToStorage(store.items());
    },
    remove(productId: string): void {
      patchState(store, {
        items: store.items().filter((it) => it.productId !== productId),
      });
      saveCartToStorage(store.items());
    },
    clear(): void {
      patchState(store, { items: [] });
      saveCartToStorage(store.items());
    },
  })),
);

export type CartStore = InstanceType<typeof CartStore>;

function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    // Corrupt JSON, disabled storage, or private mode — start empty.
    return [];
  }
}

function saveCartToStorage(items: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Quota exceeded or disabled storage — cart survives the session
    // in memory even if we can't persist it.
  }
}
