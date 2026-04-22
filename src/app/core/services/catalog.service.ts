import { computed, inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, shareReplay } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { OffersApiService } from './offers-api.service';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly offersApi = inject(OffersApiService);

  private readonly offers$ = this.offersApi.fetchOffers().pipe(shareReplay(1));

  readonly products: Signal<Product[]> = toSignal(this.offers$, {
    initialValue: [],
  });

  readonly loading: Signal<boolean> = toSignal(
    this.offers$.pipe(map(() => false)),
    { initialValue: true },
  );

  readonly byId = computed(() => {
    const map = new Map<string, Product>();
    for (const product of this.products()) {
      map.set(product.id, product);
    }
    return map;
  });

  productById(id: string): Product | undefined {
    return this.byId().get(id);
  }
}
