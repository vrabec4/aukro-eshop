import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../../core/models/product.model';
import { SettingsStoreService } from '../../../core/services/settings-store.service';
import { PricePipe } from '../../pipes/price.pipe';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [MatButtonModule, PricePipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="flex items-stretch gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    >
      <img
        [src]="product().imageUrl || fallbackImage"
        [alt]="localizedName()"
        class="h-24 w-24 flex-none rounded object-contain"
        loading="lazy"
        (error)="onImageError($event)"
      />

      <div class="flex min-w-0 flex-1 flex-col gap-2">
        <div class="flex items-start justify-between gap-2">
          <h3 class="min-w-0 truncate font-medium text-gray-900">{{ localizedName() }}</h3>
          <div class="flex-none font-semibold text-gray-900">
            {{ product().basePriceCzk | price }}
          </div>
        </div>

        <div class="text-xs text-gray-500">
          {{ pricePerUnitCzk() | price }} / {{ product().unit }}
        </div>

        <div class="mt-auto flex items-center justify-between gap-2">
          <span
            class="rounded border border-gray-200 px-2 py-1 text-sm text-gray-700"
            [attr.aria-label]="'package size'"
          >
            {{ product().quantity }} {{ product().unit }}
          </span>
          <button
            mat-flat-button
            class="!bg-green-700 !text-white"
            (click)="addToCart.emit()"
          >
            {{ 'addToBasket' | translate }}
          </button>
        </div>
      </div>
    </article>
  `,
})
export class ProductCardComponent {
  private readonly settings = inject(SettingsStoreService);

  readonly product = input.required<Product>();
  readonly addToCart = output<void>();

  readonly localizedName = computed(
    () => this.product().name[this.settings.language()],
  );

  readonly pricePerUnitCzk = computed(() => {
    const p = this.product();
    return p.quantity > 0 ? p.basePriceCzk / p.quantity : p.basePriceCzk;
  });

  protected readonly fallbackImage =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="%23e5e7eb"/></svg>';

  protected onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.src !== this.fallbackImage) {
      img.src = this.fallbackImage;
    }
  }
}
