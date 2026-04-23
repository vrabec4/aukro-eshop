import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Product } from '../../../core/models/product.model';
import { SettingsStore } from '../../../core/services/settings-store.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [FormsModule, MatButtonModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  protected readonly settings = inject(SettingsStore);

  readonly product = input.required<Product>();
  readonly addToCart = output<number>();

  // Linked to the product's default quantity: re-derives whenever the
  // product input changes, but user edits (stepper / typing in the input)
  // take precedence until the product next changes.
  protected readonly selectedAmount = linkedSignal(() => this.product().quantity);

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

  protected increment(): void {
    this.selectedAmount.set(this.roundToStep(this.selectedAmount() + this.step()));
  }

  protected decrement(): void {
    this.selectedAmount.set(
      Math.max(0, this.roundToStep(this.selectedAmount() - this.step())),
    );
  }

  // Avoid floating-point drift (0.1 + 0.2 = 0.30000000000000004) when the
  // step is 0.1 for sub-kg items — round to 1 decimal for sub-integer steps.
  private roundToStep(value: number): number {
    return this.step() < 1 ? Math.round(value * 10) / 10 : value;
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
