import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { CartLine } from '../../../core/services/cart-store.service';
import { SettingsStoreService } from '../../../core/services/settings-store.service';
import { PricePipe } from '../../pipes/price.pipe';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { UnitPipe } from '../../pipes/unit.pipe';

@Component({
  selector: 'app-cart-item-row',
  standalone: true,
  imports: [PricePipe, TranslatePipe, UnitPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex flex-col gap-4 py-5 text-sm text-slate-600 md:grid md:grid-cols-[minmax(0,2fr)_auto_auto] md:items-center md:gap-6 md:py-6 md:text-base"
    >
      <div class="flex min-w-0 items-start gap-3 md:gap-5">
        <div
          class="flex h-20 w-20 flex-none items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm sm:h-24 sm:w-24"
        >
          <img
            [src]="line().product.images.thumb"
            [alt]="localizedName()"
            class="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div class="min-w-0">
          <p class="text-base font-semibold text-slate-900 sm:truncate">
            {{ localizedName() }}
          </p>
          <div class="mt-2 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
            <span class="rounded-full bg-slate-100 px-2.5 py-1">
              {{ line().item.quantity }} {{ line().product.unit | unit }}
            </span>
            <span class="rounded-full bg-slate-100 px-2.5 py-1">
              {{ perUnitCzk() | price }} / {{ line().product.unit | unit }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between gap-3 border-t border-slate-100 pt-1 md:contents md:border-t-0 md:pt-0">
        <p class="text-lg font-semibold text-slate-900 md:text-right">
          {{ line().lineTotalCzk | price }}
        </p>

        <button
          type="button"
          class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 md:mx-auto"
          [attr.aria-label]="'remove' | translate"
          (click)="remove.emit()"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  `,
})
export class CartItemRowComponent {
  private readonly settings = inject(SettingsStoreService);

  readonly line = input.required<CartLine>();
  readonly remove = output<void>();

  readonly localizedName = computed(
    () => this.line().product.name[this.settings.language()],
  );

  readonly perUnitCzk = computed(() => {
    const p = this.line().product;
    return p.quantity > 0 ? p.basePriceCzk / p.quantity : p.basePriceCzk;
  });
}
