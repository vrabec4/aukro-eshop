import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CartStoreService } from '../../../core/services/cart-store.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { CartItemRowComponent } from '../../../shared/ui/cart-item-row/cart-item-row.component';
import { CartSummaryComponent } from '../../../shared/ui/cart-summary/cart-summary.component';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [TranslatePipe, CartItemRowComponent, CartSummaryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-5xl px-4 py-6">
      <div class="mb-6 flex items-baseline gap-3 border-b border-gray-200 pb-4">
        <h1 class="font-serif text-3xl">{{ 'basketTitle' | translate }}</h1>
        <span class="text-sm text-gray-500">
          {{ count() }} {{ 'itemsSuffix' | translate }}
        </span>
      </div>

      @if (lines().length === 0) {
        <p class="text-gray-500">{{ 'emptyCart' | translate }}</p>
      } @else {
        <div class="grid gap-4 md:grid-cols-3">
          <div class="space-y-3 md:col-span-2">
            @for (line of lines(); track line.product.id) {
              <app-cart-item-row
                [line]="line"
                (remove)="onRemove(line.product.id)"
              />
            }
          </div>
          <app-cart-summary
            [subtotalCzk]="subtotalCzk()"
            [totalCzk]="totalCzk()"
          />
        </div>
      }
    </section>
  `,
})
export class CartPageComponent {
  private readonly cart = inject(CartStoreService);

  protected readonly count = this.cart.count;
  protected readonly lines = this.cart.lines;
  protected readonly subtotalCzk = this.cart.subtotalCzk;
  protected readonly totalCzk = this.cart.totalCzk;

  protected onRemove(productId: string): void {
    this.cart.remove(productId);
  }
}
