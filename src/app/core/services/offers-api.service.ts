import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  AUKRO_SEARCH_ENDPOINT,
  CATEGORY_ID_FRUIT_VEG,
} from '../constants/aukro-api';
import { PRODUCT_NAMES } from '../constants/i18n';
import { Language } from '../models/language.model';
import {
  SearchItemDto,
  SearchItemsPage,
  SearchItemsResponse,
} from '../models/offer-dto.model';
import { Product, ProductImages, ProductUnit } from '../models/product.model';

export interface OffersPage {
  products: Product[];
  page: number; // 0-indexed
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

@Injectable({ providedIn: 'root' })
export class OffersApiService {
  private readonly http = inject(HttpClient);

  fetchPage(page: number, size: number): Observable<OffersPage> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'relevance:DESC');

    const headers = new HttpHeaders({
      'X-Accept-Currency': 'CZK',
      'X-Accept-Language': 'cs-CZ',
    });

    // Deliberately no catchError here — errors propagate to CatalogService
    // which surfaces them to the UI. Swallowing with an empty page would
    // hide real failures behind the "No products" state.
    return this.http
      .post<SearchItemsResponse>(
        AUKRO_SEARCH_ENDPOINT,
        { categoryId: CATEGORY_ID_FRUIT_VEG },
        { params, headers },
      )
      .pipe(
        map((res) => ({
          products: (res.content ?? []).map(mapSearchItemToProduct),
          page: res.page?.number ?? page,
          pageSize: res.page?.size ?? size,
          totalPages: res.page?.totalPages ?? 0,
          totalElements: res.page?.totalElements ?? 0,
        })),
      );
  }
}

function mapSearchItemToProduct(dto: SearchItemDto): Product {
  const id = String(dto.itemId);
  const priceCzk = dto.buyNowPrice?.amount ?? dto.price?.amount ?? 0;
  const apiName = dto.itemName;
  const localized = PRODUCT_NAMES[id];
  const name: Record<Language, string> = localized ?? {
    cs: apiName,
    sk: apiName,
    en: apiName,
  };

  return {
    id,
    name,
    images: imagesFromTitleUrl(dto.titleImageUrl ?? dto.titleImage?.url ?? ''),
    unit: quantityTypeToUnit(dto.quantityType),
    quantity: dto.quantity ?? 1,
    basePriceCzk: priceCzk,
  };
}

function imagesFromTitleUrl(url: string): ProductImages {
  // Aukro CDN pattern: /images/<dir>/<size>/<file>
  // size is one of: thumbnail | 73x73 | 400x300 | 730x548 | (omitted = original)
  // Swap the size segment to derive the variants we need.
  if (!url) return { thumb: '', card: '', full: '' };
  const swap = (size: string) =>
    url.replace(/\/(thumbnail|73x73|400x300|730x548)\//, `/${size}/`);
  return { thumb: swap('73x73'), card: swap('400x300'), full: swap('730x548') };
}

function quantityTypeToUnit(qt: string | undefined): ProductUnit {
  // Map Aukro's quantityType 1:1. The API is the source of truth — no name
  // regex. Extend the switch if Aukro ever adds weight/volume variants.
  switch (qt) {
    case 'sets':
      return 'pack';
    case 'kilograms':
    case 'weight':
      return 'kg';
    case 'pieces':
    default:
      return 'pcs';
  }
}

// Re-export so callers have a typed view of the page metadata if needed.
export type { SearchItemsPage };
