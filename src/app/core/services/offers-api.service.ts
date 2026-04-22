import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  AUKRO_OFFERS_ENDPOINT,
  LIVE_OFFER_IDS,
  LOCAL_OFFERS_PATH,
} from '../constants/offer-ids';
import { PRODUCT_NAMES } from '../constants/i18n';
import { Language } from '../models/language.model';
import { CarouselOffersResponse, OfferDto } from '../models/offer-dto.model';
import { Product, ProductUnit } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class OffersApiService {
  private readonly http = inject(HttpClient);

  /**
   * Merge strategy (Option M):
   *  1. Call the real Aukro endpoint. 12 of 14 pinned IDs are expired; 2 remain.
   *  2. Always load /offers.json as a fruit/veg supplement (and sole fallback).
   *  3. Concatenate and map both DTO streams to Product view models.
   *  Either call failing individually is swallowed to an empty list — a total
   *  failure only happens if /offers.json is missing.
   */
  fetchOffers(): Observable<Product[]> {
    const params = new HttpParams()
      .set('currency', 'CZK')
      .set('ids', LIVE_OFFER_IDS.join(','));

    const live$ = this.http
      .get<CarouselOffersResponse>(AUKRO_OFFERS_ENDPOINT, { params })
      .pipe(
        map((response) => response.content ?? []),
        catchError(() => of<OfferDto[]>([])),
      );

    const fallback$ = this.http
      .get<OfferDto[]>(LOCAL_OFFERS_PATH)
      .pipe(catchError(() => of<OfferDto[]>([])));

    return forkJoin([live$, fallback$]).pipe(
      map(([live, extra]) => [...live, ...extra].map(mapDtoToProduct)),
    );
  }
}

function mapDtoToProduct(dto: OfferDto): Product {
  const id = String(dto.id);
  const imageUrl =
    dto.images?.lists?.medium?.[0]?.url ??
    dto.images?.lists?.large?.[0]?.url ??
    dto.images?.lists?.original?.[0]?.url ??
    '';
  const basePriceCzk = dto.buyNowPrice?.amount ?? dto.biddingPrice?.amount ?? 0;
  const apiName = dto.name;
  const localized = PRODUCT_NAMES[id];
  const name: Record<Language, string> = localized ?? {
    cs: apiName,
    sk: apiName,
    en: apiName,
  };

  return {
    id,
    name,
    imageUrl,
    unit: dto.unit ?? ('pcs' as ProductUnit),
    quantity: dto.quantity ?? 1,
    basePriceCzk,
  };
}
