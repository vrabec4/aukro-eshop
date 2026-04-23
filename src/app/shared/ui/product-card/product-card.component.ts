import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Product } from '../../../core/models/product.model';
import { SettingsStoreService } from '../../../core/services/settings-store.service';
import { PricePipe } from '../../pipes/price.pipe';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { UnitPipe } from '../../pipes/unit.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    PricePipe,
    TranslatePipe,
    UnitPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-card.component.html',
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
