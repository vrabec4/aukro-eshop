import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  AUKRO_SEARCH_ENDPOINT,
  CATEGORY_ID_FRUIT_VEG,
} from '../constants/offer-ids';
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

const EMPTY_PAGE: OffersPage = {
  products: [],
  page: 0,
  pageSize: 0,
  totalPages: 0,
  totalElements: 0,
};

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
        catchError(() => of<OffersPage>({ ...EMPTY_PAGE, page, pageSize: size })),
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
  // Aukro sends `pieces` for single items and `sets` for multi-packs
  // (e.g. 4× 314 ml mandarinky, jars of jam, 3-pack of pineapple). Map
  // sets to `pack` so the UI doesn't say "zväzok/bundle" for canned goods.
  if (qt === 'sets') return 'pack';
  return 'pcs';
}

// Re-export so callers have a typed view of the page metadata if needed.
export type { SearchItemsPage };
