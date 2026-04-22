import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../core/models/product.model';
import { SettingsStoreService } from '../../../core/services/settings-store.service';
import { PricePipe } from '../../pipes/price.pipe';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { UnitPipe } from '../../pipes/unit.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [FormsModule, PricePipe, TranslatePipe, UnitPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition hover:shadow-lg md:min-h-[18rem] md:flex-row"
    >
      <div
        class="relative h-64 w-full flex-none overflow-hidden bg-slate-100 md:h-auto md:w-[42%]"
      >
        <img
          [src]="product().images.card || fallbackImage"
          [srcset]="cardSrcset()"
          sizes="(min-width: 768px) 42vw, 100vw"
          [alt]="localizedName()"
          class="absolute inset-0 h-full w-full object-cover object-center"
          width="400"
          height="300"
          loading="lazy"
          decoding="async"
          (error)="onImageError($event)"
        />
      </div>

      <div class="flex flex-1 flex-col gap-4 p-5">
        <div class="flex items-start justify-between gap-3">
          <h3 class="line-clamp-2 text-lg font-medium text-slate-800">
            {{ localizedName() }}
          </h3>
        </div>

        <p class="text-sm text-slate-500">
          {{ pricePerUnitCzk() | price }} / {{ product().unit | unit }}
        </p>

        <p class="text-xl font-medium text-slate-800">
          {{ lineTotalCzk() | price }}
        </p>

        <div class="mt-auto flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <div
              class="flex w-fit items-center gap-1 border border-slate-300 px-2 py-1 text-sm text-slate-700"
            >
              <input
                type="number"
                min="0"
                [step]="step()"
                [ngModel]="selectedAmount()"
                (ngModelChange)="onAmountChange($event)"
                class="w-14 bg-transparent text-right outline-none"
                [attr.aria-label]="'amount'"
              />
              <span>{{ product().unit | unit }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="ml-1 h-3.5 w-3.5 text-slate-400"
                aria-hidden="true"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
              </svg>
            </div>
          </div>

          <button
            type="button"
            class="w-full cursor-pointer rounded bg-slate-800 px-8 py-2 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-slate-900 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-56"
            [disabled]="selectedAmount() <= 0"
            (click)="addToCart.emit(selectedAmount())"
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
  readonly addToCart = output<number>();

  protected readonly selectedAmount = signal(0);

  constructor() {
    // Keep the input in sync with the product's default package size whenever
    // the product changes (this also initialises the value on first render).
    effect(() => {
      this.selectedAmount.set(this.product().quantity);
    });
  }

  readonly localizedName = computed(
    () => this.product().name[this.settings.language()],
  );

  readonly pricePerUnitCzk = computed(() => {
    const p = this.product();
    return p.quantity > 0 ? p.basePriceCzk / p.quantity : p.basePriceCzk;
  });

  readonly lineTotalCzk = computed(
    () => this.pricePerUnitCzk() * this.selectedAmount(),
  );

  readonly step = computed(() => {
    const q = this.product().quantity;
    // 0.1 for sub-kg items, 1 otherwise.
    return q < 1 ? 0.1 : 1;
  });

  readonly cardSrcset = computed(() => {
    const { card, full } = this.product().images;
    if (!card) return null;
    return full && full !== card ? `${card} 400w, ${full} 730w` : null;
  });

  protected onAmountChange(value: number | null): void {
    this.selectedAmount.set(value && value > 0 ? value : 0);
  }

  protected readonly fallbackImage =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="%23e5e7eb"/></svg>';

  protected onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.src !== this.fallbackImage) {
      img.src = this.fallbackImage;
    }
  }
}
