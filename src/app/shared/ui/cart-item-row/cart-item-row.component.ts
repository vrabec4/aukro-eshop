import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CartLine } from '../../../core/services/cart-store.service';
import { SettingsStoreService } from '../../../core/services/settings-store.service';
import { PricePipe } from '../../pipes/price.pipe';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { UnitPipe } from '../../pipes/unit.pipe';

@Component({
  selector: 'app-cart-item-row',
  standalone: true,
  imports: [MatButtonModule, PricePipe, TranslatePipe, UnitPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart-item-row.component.html',
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
