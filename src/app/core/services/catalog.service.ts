import { effect, inject, Injectable, signal } from '@angular/core';
import { DEFAULT_PAGE_SIZE } from '../constants/pagination';
import { Product } from '../models/product.model';
import { OffersApiService } from './offers-api.service';

interface CachedPage {
  products: Product[];
  totalPages: number;
  totalElements: number;
}

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly offersApi = inject(OffersApiService);

  private readonly _page = signal(0);
  private readonly _pageSize = signal(DEFAULT_PAGE_SIZE);
  private readonly _products = signal<Product[]>([]);
  private readonly _totalPages = signal(0);
  private readonly _totalElements = signal(0);
  private readonly _loading = signal(true);
  private readonly _error = signal(false);

  readonly page = this._page.asReadonly();
  readonly pageSize = this._pageSize.asReadonly();
  readonly products = this._products.asReadonly();
  readonly totalPages = this._totalPages.asReadonly();
  readonly totalElements = this._totalElements.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  private requestId = 0;

  // Cache of pages keyed by `${page}:${size}`. Re-visiting a page within
  // the session is served instantly from memory instead of re-fetching.
  // Only successful fetches are cached — a failure never poisons a page
  // key, so the user can retry without reloading the whole app.
  private readonly cache = new Map<string, CachedPage>();

  constructor() {
    effect(() => {
      const page = this._page();
      const size = this._pageSize();
      this.load(page, size);
    });
  }

  setPage(page: number): void {
    const clamped = Math.max(
      0,
      Math.min(page, Math.max(0, this._totalPages() - 1)),
    );
    this._page.set(clamped);
  }

  setPageSize(size: number): void {
    if (size <= 0 || size === this._pageSize()) return;
    this._pageSize.set(size);
    this._page.set(0);
  }

  /** Re-fetch the current page/size without serving from cache. */
  retry(): void {
    this.load(this._page(), this._pageSize());
  }

  private load(page: number, size: number): void {
    // Bump requestId on every load so any in-flight fetch for a
    // previous page is ignored on resolve, even when the new load is
    // served from cache (otherwise a slow prior fetch can overwrite
    // the cache-hit state).
    const myId = ++this.requestId;
    const key = `${page}:${size}`;
    const cached = this.cache.get(key);
    if (cached) {
      this._error.set(false);
      this.apply(cached);
      return;
    }
    this._loading.set(true);
    this._error.set(false);
    this.offersApi.fetchPage(page, size).subscribe({
      next: (result) => {
        if (myId !== this.requestId) return;
        this.cache.set(key, result);
        this.apply(result);
      },
      error: () => {
        if (myId !== this.requestId) return;
        this._error.set(true);
        this._loading.set(false);
      },
    });
  }

  private apply(page: CachedPage): void {
    this._products.set(page.products);
    this._totalPages.set(page.totalPages);
    this._totalElements.set(page.totalElements);
    this._loading.set(false);
  }
}
