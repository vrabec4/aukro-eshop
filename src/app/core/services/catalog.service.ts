import {
  computed,
  effect,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { DEFAULT_PAGE_SIZE } from '../constants/offer-ids';
import { Product } from '../models/product.model';
import { OffersApiService } from './offers-api.service';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly offersApi = inject(OffersApiService);

  private readonly _page = signal(0);
  private readonly _pageSize = signal(DEFAULT_PAGE_SIZE);
  private readonly _products = signal<Product[]>([]);
  private readonly _totalPages = signal(0);
  private readonly _totalElements = signal(0);
  private readonly _loading = signal(true);

  readonly page = this._page.asReadonly();
  readonly pageSize = this._pageSize.asReadonly();
  readonly products = this._products.asReadonly();
  readonly totalPages = this._totalPages.asReadonly();
  readonly totalElements = this._totalElements.asReadonly();
  readonly loading = this._loading.asReadonly();

  private requestId = 0;

  readonly byId = computed(() => {
    const map = new Map<string, Product>();
    for (const product of this._products()) map.set(product.id, product);
    return map;
  });

  constructor() {
    // Trigger a fresh fetch whenever page or pageSize changes.
    effect(() => {
      const page = this._page();
      const size = this._pageSize();
      this.load(page, size);
    });
  }

  productById(id: string): Product | undefined {
    return this.byId().get(id);
  }

  setPage(page: number): void {
    const clamped = Math.max(0, Math.min(page, Math.max(0, this._totalPages() - 1)));
    this._page.set(clamped);
  }

  setPageSize(size: number): void {
    if (size <= 0 || size === this._pageSize()) return;
    this._pageSize.set(size);
    this._page.set(0);
  }

  private load(page: number, size: number): void {
    this._loading.set(true);
    // Guard against out-of-order responses: only the latest request wins.
    const myId = ++this.requestId;
    this.offersApi.fetchPage(page, size).subscribe((result) => {
      if (myId !== this.requestId) return;
      this._products.set(result.products);
      this._totalPages.set(result.totalPages);
      this._totalElements.set(result.totalElements);
      this._loading.set(false);
    });
  }
}
