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

  it('aggregates quantities and keeps total equal to product subtotal', () => {
    service.add('apple');
    service.add('apple');
    service.add('banana');

    expect(service.count()).toBe(3);
    expect(service.lines()).toHaveLength(2);
    expect(service.subtotalCzk()).toBe(133);
    expect(service.totalCzk()).toBe(133);
  });

  it('removes items when quantity reaches zero', () => {
    service.add('apple', 2);

    service.decrement('apple');
    expect(service.count()).toBe(1);

    service.decrement('apple');
    expect(service.count()).toBe(0);
    expect(service.lines()).toHaveLength(0);
    expect(service.totalCzk()).toBe(0);
  });
});
