import { computed, inject, Injectable } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { signal } from '@angular/core';
import { DEFAULT_PAGE_SIZE } from '../constants/offer-ids';
import { Product } from '../models/product.model';
import { OffersApiService, OffersPage } from './offers-api.service';

interface CatalogState extends OffersPage {
  loading: boolean;
}

const EMPTY_STATE: CatalogState = {
  loading: true,
  products: [],
  page: 0,
  pageSize: DEFAULT_PAGE_SIZE,
  totalPages: 0,
  totalElements: 0,
};

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly offersApi = inject(OffersApiService);

  private readonly _page = signal(0);
  private readonly _pageSize = signal(DEFAULT_PAGE_SIZE);

  readonly page = this._page.asReadonly();
  readonly pageSize = this._pageSize.asReadonly();

  // Bridge from the (page, pageSize) signals into an HTTP request and back
  // into a signal via toSignal. switchMap cancels stale in-flight requests,
  // startWith emits a loading marker each time the user changes the page.
  private readonly state = toSignal(
    combineLatest({
      page: toObservable(this._page),
      pageSize: toObservable(this._pageSize),
    }).pipe(
      switchMap(({ page, pageSize }) =>
        this.offersApi.fetchPage(page, pageSize).pipe(
          map((result): CatalogState => ({ ...result, loading: false })),
          startWith<CatalogState>({ ...EMPTY_STATE, loading: true, page, pageSize }),
        ),
      ),
    ),
    { initialValue: EMPTY_STATE, requireSync: false },
  );

  readonly products = computed(() => this.state().products);
  readonly loading = computed(() => this.state().loading);
  readonly totalPages = computed(() => this.state().totalPages);
  readonly totalElements = computed(() => this.state().totalElements);

  readonly byId = computed(() => {
    const map = new Map<string, Product>();
    for (const product of this.products()) map.set(product.id, product);
    return map;
  });

  productById(id: string): Product | undefined {
    return this.byId().get(id);
  }

  setPage(page: number): void {
    const clamped = Math.max(0, Math.min(page, Math.max(0, this.totalPages() - 1)));
    this._page.set(clamped);
  }

  setPageSize(size: number): void {
    if (size <= 0 || size === this._pageSize()) return;
    this._pageSize.set(size);
    this._page.set(0);
  }
}
