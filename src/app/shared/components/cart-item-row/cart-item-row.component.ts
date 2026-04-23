import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CartLine } from '../../../core/services/cart-store.service';
import { SettingsStore } from '../../../core/services/settings-store.service';

@Component({
  selector: 'app-cart-item-row',
  standalone: true,
  imports: [TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart-item-row.component.html',
})
export class CartItemRowComponent {
  protected readonly settings = inject(SettingsStore);

  readonly line = input.required<CartLine>();
  readonly remove = output<void>();

  readonly localizedName = computed(
    () => this.line().product.name[this.settings.language()],
  );

  readonly perUnitCzk = computed(() => {
    const p = this.line().product;
    return p.quantity > 0 ? p.basePriceCzk / p.quantity : p.basePriceCzk;
  });

  // Let the browser pick between the 73×73 thumb and the 400×300 card
  // based on DPR. On a 2× retina display the 96×96 slot needs ~192
  // physical pixels — the thumb alone blurs heavily.
  readonly thumbSrcset = computed(() => {
    const { thumb, card } = this.line().product.images;
    if (!thumb) return null;
    return card && card !== thumb ? `${thumb} 73w, ${card} 400w` : null;
  });
}
