import { TestBed } from '@angular/core/testing';
import { Product } from '../models/product.model';
import { CatalogService } from './catalog.service';
import { CartStoreService } from './cart-store.service';

describe('CartStoreService', () => {
  let service: CartStoreService;

  const products = new Map<string, Product>([
    [
      'apple',
      {
        id: 'apple',
        name: { cs: 'Jablko', sk: 'Jablko', en: 'Apple' },
        imageUrl: '/apple.svg',
        unit: 'kg',
        quantity: 1,
        basePriceCzk: 49,
      },
    ],
    [
      'banana',
      {
        id: 'banana',
        name: { cs: 'Banan', sk: 'Banán', en: 'Banana' },
        imageUrl: '/banana.svg',
        unit: 'kg',
        quantity: 1,
        basePriceCzk: 35,
      },
    ],
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CartStoreService,
        {
          provide: CatalogService,
          useValue: {
            productById: (id: string) => products.get(id),
          },
        },
      ],
    });

    service = TestBed.inject(CartStoreService);
  });

  it('aggregates amounts for the same product and computes subtotal', () => {
    service.add('apple', 1);
    service.add('apple', 1);
    service.add('banana', 1);

    expect(service.count()).toBe(2); // two distinct products
    expect(service.lines()).toHaveLength(2);
    expect(service.subtotalCzk()).toBe(133); // 2×49 + 1×35
  });

  it('applies shipping and tax on top of subtotal', () => {
    service.add('apple', 1); // 49 CZK
    expect(service.subtotalCzk()).toBe(49);
    expect(service.shippingCzk()).toBe(100);
    expect(service.taxCzk()).toBeCloseTo(49 * 0.05, 5);
    expect(service.totalCzk()).toBeCloseTo(49 + 100 + 49 * 0.05, 5);
  });

  it('clears the cart and zeroes shipping + tax when empty', () => {
    service.add('apple', 2);
    service.remove('apple');

    expect(service.count()).toBe(0);
    expect(service.lines()).toHaveLength(0);
    expect(service.subtotalCzk()).toBe(0);
    expect(service.shippingCzk()).toBe(0);
    expect(service.taxCzk()).toBe(0);
    expect(service.totalCzk()).toBe(0);
  });
});
