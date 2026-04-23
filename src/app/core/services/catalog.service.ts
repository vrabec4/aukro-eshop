import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { DEFAULT_PAGE_SIZE } from '../constants/pagination';
import { Product } from '../models/product.model';
import { OffersApiService } from './offers-api.service';

interface CachedPage {
  products: Product[];
  totalPages: number;
  totalElements: number;
}

interface CatalogState {
  page: number;
  pageSize: number;
  products: Product[];
  totalPages: number;
  totalElements: number;
  loading: boolean;
  error: boolean;
}

export const CatalogStore = signalStore(
  { providedIn: 'root' },
  withState<CatalogState>({
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    products: [],
    totalPages: 0,
    totalElements: 0,
    loading: true,
    error: false,
  }),
  withProps(() => ({
    _offersApi: inject(OffersApiService),
    // Cache of pages keyed by `${page}:${size}`. Re-visiting a page within
    // the session is served instantly from memory instead of re-fetching.
    // Only successful fetches are cached — a failure never poisons a page
    // key, so the user can retry without reloading the whole app.
    _cache: new Map<string, CachedPage>(),
    // Request-id counter so any in-flight fetch for a previous page is
    // ignored on resolve. Wrapped in an object so methods can mutate it.
    _reqRef: { current: 0 },
  })),
  withMethods((store) => {
    function apply(page: CachedPage): void {
      patchState(store, {
        products: page.products,
        totalPages: page.totalPages,
        totalElements: page.totalElements,
        loading: false,
      });
    }

    function load(page: number, size: number): void {
      const myId = ++store._reqRef.current;
      const key = `${page}:${size}`;
      const cached = store._cache.get(key);
      if (cached) {
        patchState(store, { error: false });
        apply(cached);
        return;
      }
      patchState(store, { loading: true, error: false });
      store._offersApi.fetchPage(page, size).subscribe({
        next: (result) => {
          if (myId !== store._reqRef.current) return;
          store._cache.set(key, result);
          apply(result);
        },
        error: () => {
          if (myId !== store._reqRef.current) return;
          patchState(store, { error: true, loading: false });
        },
      });
    }

    return {
      setPage(page: number): void {
        const clamped = Math.max(
          0,
          Math.min(page, Math.max(0, store.totalPages() - 1)),
        );
        if (clamped === store.page()) return;
        patchState(store, { page: clamped });
        load(clamped, store.pageSize());
      },
      setPageSize(size: number): void {
        if (size <= 0 || size === store.pageSize()) return;
        patchState(store, { pageSize: size, page: 0 });
        load(0, size);
      },
      /** Re-fetch the current page/size without serving from cache. */
      retry(): void {
        load(store.page(), store.pageSize());
      },
    };
  }),
  withHooks({
    onInit(store) {
      store.retry();
    },
  }),
);

export type CatalogStore = InstanceType<typeof CatalogStore>;
