import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AUKRO_OFFERS_ENDPOINT, LIVE_OFFER_IDS } from '../constants/offer-ids';
import { PRODUCT_NAMES } from '../constants/i18n';
import { Language } from '../models/language.model';
import { CarouselOffersResponse, OfferDto } from '../models/offer-dto.model';
import { Product, ProductUnit } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class OffersApiService {
  private readonly http = inject(HttpClient);

  fetchOffers(): Observable<Product[]> {
    const params = new HttpParams()
      .set('currency', 'CZK')
      .set('ids', LIVE_OFFER_IDS.join(','));

    return this.http
      .get<CarouselOffersResponse>(AUKRO_OFFERS_ENDPOINT, { params })
      .pipe(
        map((response) => (response.content ?? []).map(mapDtoToProduct)),
        catchError(() => of<Product[]>([])),
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
