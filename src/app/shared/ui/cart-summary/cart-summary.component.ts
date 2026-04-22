import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PricePipe } from '../../pipes/price.pipe';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [PricePipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="h-fit rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 class="mb-4 text-lg font-medium">{{ 'orderSummary' | translate }}</h2>
      <dl class="space-y-2">
        <div class="flex justify-between text-sm">
          <dt class="text-gray-600">{{ 'subtotal' | translate }}</dt>
          <dd>{{ subtotalCzk() | price }}</dd>
        </div>
        <div class="flex justify-between border-t border-gray-200 pt-2 font-semibold">
          <dt>{{ 'total' | translate }}</dt>
          <dd>{{ totalCzk() | price }}</dd>
        </div>
      </dl>
    </aside>
  `,
})
export class CartSummaryComponent {
  readonly subtotalCzk = input.required<number>();
  readonly totalCzk = input.required<number>();
}
