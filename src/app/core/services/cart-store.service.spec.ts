import { TestBed } from '@angular/core/testing';
import { Product } from '../models/product.model';
import { CartStoreService } from './cart-store.service';

describe('CartStoreService', () => {
  let service: CartStoreService;

  const apple: Product = {
    id: 'apple',
    name: { cs: 'Jablko', sk: 'Jablko', en: 'Apple' },
    images: { thumb: '/apple-s.svg', card: '/apple-m.svg', full: '/apple-l.svg' },
    unit: 'kg',
    quantity: 1,
    basePriceCzk: 49,
  };

  const banana: Product = {
    id: 'banana',
    name: { cs: 'Banan', sk: 'Banán', en: 'Banana' },
    images: { thumb: '/banana-s.svg', card: '/banana-m.svg', full: '/banana-l.svg' },
    unit: 'kg',
    quantity: 1,
    basePriceCzk: 35,
  };

  beforeEach(() => {
    // Reset persisted state between tests so one test's cart can't bleed
    // into the next.
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [CartStoreService],
    });

    service = TestBed.inject(CartStoreService);
  });

  it('aggregates amounts for the same product and computes subtotal', () => {
    service.add(apple, 1);
    service.add(apple, 1);
    service.add(banana, 1);

    expect(service.count()).toBe(2); // two distinct products
    expect(service.lines()).toHaveLength(2);
    expect(service.subtotalCzk()).toBe(133); // 2×49 + 1×35
  });

  it('applies shipping and tax on top of subtotal', () => {
    service.add(apple, 1); // 49 CZK
    expect(service.subtotalCzk()).toBe(49);
    expect(service.shippingCzk()).toBe(100);
    expect(service.taxCzk()).toBeCloseTo(49 * 0.05, 5);
    expect(service.totalCzk()).toBeCloseTo(49 + 100 + 49 * 0.05, 5);
  });

  it('clears the cart and zeroes shipping + tax when empty', () => {
    service.add(apple, 2);
    service.remove('apple');

    expect(service.count()).toBe(0);
    expect(service.lines()).toHaveLength(0);
    expect(service.subtotalCzk()).toBe(0);
    expect(service.shippingCzk()).toBe(0);
    expect(service.taxCzk()).toBe(0);
    expect(service.totalCzk()).toBe(0);
  });

  it('ignores add() with zero or negative amount', () => {
    service.add(apple, 0);
    service.add(apple, -5);
    expect(service.count()).toBe(0);
  });

  it('renders cart lines from stored snapshot without catalog access', () => {
    // Snapshot-in-CartItem means the cart survives the catalog forgetting
    // about the product (e.g. paged past it, or a fresh page load).
    service.add(apple, 3);
    const [line] = service.lines();
    expect(line.product.name.en).toBe('Apple');
    expect(line.product.images.thumb).toBe('/apple-s.svg');
    expect(line.lineTotalCzk).toBe(49 * 3);
  });

  it('starts empty when localStorage has no prior cart', () => {
    // beforeEach clears localStorage, so this mirrors a first-ever visit.
    expect(service.count()).toBe(0);
    expect(service.lines()).toHaveLength(0);
  });

  it('persists items across service instances (simulates a page refresh)', () => {
    service.add(apple, 2);
    service.add(banana, 1);

    // Drop the current TestBed/service and spin up a fresh one — localStorage
    // is the only thing that survives. This is exactly what a reload does.
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [CartStoreService] });
    const reloaded = TestBed.inject(CartStoreService);

    expect(reloaded.count()).toBe(2);
    expect(reloaded.subtotalCzk()).toBe(2 * 49 + 35);
    expect(reloaded.lines()[0].product.name.en).toBe('Apple');
  });

  it('falls back to an empty cart when localStorage contains invalid JSON', () => {
    localStorage.setItem('aukro-eshop:cart:v1', '{not valid json');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [CartStoreService] });
    const recovered = TestBed.inject(CartStoreService);

    expect(recovered.count()).toBe(0);
    // Next mutation self-heals the corrupt value.
    recovered.clear();
    expect(localStorage.getItem('aukro-eshop:cart:v1')).toBe('[]');
  });
});
