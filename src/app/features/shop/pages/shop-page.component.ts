import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { PAGE_SIZE_OPTIONS } from '../../../core/constants/offer-ids';
import { Product } from '../../../core/models/product.model';
import { CartStoreService } from '../../../core/services/cart-store.service';
import { CatalogService } from '../../../core/services/catalog.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { ProductCardComponent } from '../../../shared/ui/product-card/product-card.component';

@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslatePipe,
    ProductCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h1 class="text-3xl font-medium text-slate-800">
          {{ 'shopTitle' | translate }}
          <span class="ml-2 text-sm text-indigo-500">
            {{ totalElements() }} {{ 'itemsSuffix' | translate }}
          </span>
        </h1>

        <label class="flex items-center gap-2 text-sm text-slate-600">
          <span>{{ 'perPage' | translate }}</span>
          <mat-form-field
            class="no-chrome cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm"
            appearance="outline"
          >
            <mat-select
              [value]="pageSize()"
              (valueChange)="onPageSizeChange($event)"
              panelClass="rounded-xl"
            >
              @for (opt of pageSizeOptions; track opt) {
                <mat-option [value]="opt">{{ opt }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </label>
      </div>

      @if (loading()) {
        <p class="text-gray-500">{{ 'loading' | translate }}</p>
      } @else if (products().length === 0) {
        <p class="text-gray-500">{{ 'emptyShop' | translate }}</p>
      } @else {
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          @for (product of products(); track product.id) {
            <app-product-card
              [product]="product"
              (addToCart)="onAddToCart(product, $event)"
            />
          }
        </div>

        @if (totalPages() > 1) {
          <nav
            aria-label="Pagination"
            class="mt-10 flex flex-wrap items-center justify-center gap-2"
          >
            <button
              mat-stroked-button
              type="button"
              class="inline-flex h-10 items-center rounded-full border border-slate-200 !bg-white px-4 text-sm font-medium !text-slate-700 shadow-sm transition hover:!bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              [disabled]="page() === 0"
              (click)="onPageChange(page() - 1)"
            >
              ← {{ 'previous' | translate }}
            </button>

            @for (n of pageNumbers(); track n) {
              <button
                mat-button
                type="button"
                class="h-10 min-w-10 rounded-full px-3 text-sm font-medium transition"
                [class.!bg-indigo-600]="n === page()"
                [class.!text-white]="n === page()"
                [class.shadow-md]="n === page()"
                [class.border]="n !== page()"
                [class.border-slate-200]="n !== page()"
                [class.!bg-white]="n !== page()"
                [class.!text-slate-700]="n !== page()"
                [class.hover:!bg-slate-50]="n !== page()"
                (click)="onPageChange(n)"
              >
                {{ n + 1 }}
              </button>
            }

            <button
              mat-stroked-button
              type="button"
              class="inline-flex h-10 items-center rounded-full border border-slate-200 !bg-white px-4 text-sm font-medium !text-slate-700 shadow-sm transition hover:!bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              [disabled]="page() >= totalPages() - 1"
              (click)="onPageChange(page() + 1)"
            >
              {{ 'next' | translate }} →
            </button>
          </nav>
        }
      }
    </section>
  `,
})
export class ShopPageComponent {
  private readonly catalog = inject(CatalogService);
  private readonly cart = inject(CartStoreService);

  protected readonly products = this.catalog.products;
  protected readonly loading = this.catalog.loading;
  protected readonly page = this.catalog.page;
  protected readonly pageSize = this.catalog.pageSize;
  protected readonly totalPages = this.catalog.totalPages;
  protected readonly totalElements = this.catalog.totalElements;
  protected readonly pageSizeOptions = PAGE_SIZE_OPTIONS;

  protected readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.page();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i);
    // Sliding window of 5 around current, always keeping first/last reachable via prev/next.
    const start = Math.max(0, Math.min(current - 2, total - 5));
    return Array.from({ length: 5 }, (_, i) => start + i);
  });

  protected onAddToCart(product: Product, amount: number): void {
    this.cart.add(product.id, amount);
  }

  protected onPageChange(page: number): void {
    this.catalog.setPage(page);
  }

  protected onPageSizeChange(size: number): void {
    this.catalog.setPageSize(size);
  }
}
