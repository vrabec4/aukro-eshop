import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CartLine } from '../../../core/services/cart-store.service';
import { SettingsStoreService } from '../../../core/services/settings-store.service';
import { PricePipe } from '../../pipes/price.pipe';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-cart-item-row',
  standalone: true,
  imports: [MatButtonModule, PricePipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    >
      <img
        [src]="line().product.imageUrl"
        [alt]="localizedName()"
        class="h-20 w-20 flex-none rounded object-contain"
        loading="lazy"
      />

      <div class="flex min-w-0 flex-1 flex-col gap-1">
        <h3 class="truncate font-medium text-gray-900">{{ localizedName() }}</h3>
        <p class="text-xs text-gray-500">
          {{ perUnitCzk() | price }} / {{ line().product.unit }}
          · {{ line().item.quantity }}× {{ line().product.quantity }} {{ line().product.unit }}
        </p>
      </div>

      <div class="flex flex-none flex-col items-end gap-2">
        <span class="font-semibold text-gray-900">{{ line().lineTotalCzk | price }}</span>
        <button
          mat-flat-button
          class="!bg-red-600 !text-white"
          (click)="remove.emit()"
        >
          {{ 'remove' | translate }}
        </button>
      </div>
    </article>
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
