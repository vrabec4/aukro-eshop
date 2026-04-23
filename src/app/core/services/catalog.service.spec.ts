import { TestBed } from '@angular/core/testing';
import { Subject, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { CatalogStore } from './catalog.service';
import { OffersApiService, OffersPage } from './offers-api.service';

describe('CatalogStore', () => {
  // One subject per page/size key so each test can control when a
  // specific fetch resolves (or errors). Lets us simulate races and
  // cache behavior deterministically.
  let subjects: Map<string, Subject<OffersPage>>;
  let fetchSpy: jest.Mock;

  function makePage(page: number, size: number, totalPages = 3, totalElements = 30): OffersPage {
    const products: Product[] = Array.from({ length: size }, (_, i) => ({
      id: `p${page}-${i}`,
      name: { cs: 'X', sk: 'X', en: 'X' },
      images: { thumb: '', card: '', full: '' },
      unit: 'kg',
      quantity: 1,
      basePriceCzk: 10,
    }));
    return { products, page, pageSize: size, totalPages, totalElements };
  }

  function pendingFetch(page: number, size: number): Subject<OffersPage> {
    const key = `${page}:${size}`;
    let subj = subjects.get(key);
    if (!subj) {
      subj = new Subject<OffersPage>();
      subjects.set(key, subj);
    }
    return subj;
  }

  beforeEach(() => {
    subjects = new Map();
    fetchSpy = jest.fn((page: number, size: number) => pendingFetch(page, size));
    TestBed.configureTestingModule({
      providers: [
        { provide: OffersApiService, useValue: { fetchPage: fetchSpy } },
      ],
    });
  });

  it('fetches the initial page on construction', () => {
    const service = TestBed.inject(CatalogStore);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(0, 12);
    expect(service.loading()).toBe(true);
    expect(service.error()).toBe(false);

    pendingFetch(0, 12).next(makePage(0, 12));
    expect(service.loading()).toBe(false);
    expect(service.products()).toHaveLength(12);
    expect(service.totalPages()).toBe(3);
  });

  it('clamps setPage within [0, totalPages - 1]', () => {
    const service = TestBed.inject(CatalogStore);
    pendingFetch(0, 12).next(makePage(0, 12, 5));

    service.setPage(99);
    expect(service.page()).toBe(4);

    service.setPage(-7);
    expect(service.page()).toBe(0);
  });

  it('serves a revisited page from cache without a second fetch', () => {
    const service = TestBed.inject(CatalogStore);
    pendingFetch(0, 12).next(makePage(0, 12, 3));

    // Navigate to page 1 (cache miss)
    service.setPage(1);
    pendingFetch(1, 12).next(makePage(1, 12, 3));
    expect(fetchSpy).toHaveBeenCalledTimes(2);

    // Return to page 0 — cache hit, no new fetch
    service.setPage(0);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(service.loading()).toBe(false);
    expect(service.products()[0].id).toBe('p0-0');
  });

  it('ignores a late response from a superseded in-flight fetch', () => {
    const service = TestBed.inject(CatalogStore);
    // Seed page 0 so totalPages is populated and setPage can navigate.
    pendingFetch(0, 12).next(makePage(0, 12, 3));
    service.setPage(2); // cache miss, new fetch in-flight
    // Page 2 fetch is in flight; now navigate again to page 1
    service.setPage(1);
    pendingFetch(1, 12).next(makePage(1, 12, 3));
    expect(service.products()[0].id).toBe('p1-0');

    // Page 2 response arrives LATE — must be ignored
    pendingFetch(2, 12).next(makePage(2, 12, 3));
    expect(service.products()[0].id).toBe('p1-0'); // still page 1
  });

  it('surfaces an error and does not cache a failed fetch', () => {
    const service = TestBed.inject(CatalogStore);

    // Swap the subject for an errored observable on the next call
    fetchSpy.mockImplementationOnce(() => throwError(() => new Error('boom')));
    service.retry();

    expect(service.error()).toBe(true);
    expect(service.loading()).toBe(false);

    // Retry after recovery: the failed page key must NOT be cached, so
    // fetchSpy is called again.
    const callsBeforeRetry = fetchSpy.mock.calls.length;
    service.retry();
    expect(fetchSpy.mock.calls.length).toBeGreaterThan(callsBeforeRetry);
  });

  it('clears error state on a successful retry', () => {
    const service = TestBed.inject(CatalogStore);

    fetchSpy.mockImplementationOnce(() => throwError(() => new Error('boom')));
    service.retry();
    expect(service.error()).toBe(true);

    service.retry();
    pendingFetch(0, 12).next(makePage(0, 12, 3));
    expect(service.error()).toBe(false);
    expect(service.products()).toHaveLength(12);
  });

  it('resets to page 0 when page size changes', () => {
    const service = TestBed.inject(CatalogStore);
    pendingFetch(0, 12).next(makePage(0, 12, 5));

    service.setPage(3);
    pendingFetch(3, 12).next(makePage(3, 12, 5));
    expect(service.page()).toBe(3);

    service.setPageSize(24);
    expect(service.page()).toBe(0);
    expect(service.pageSize()).toBe(24);
  });
});
