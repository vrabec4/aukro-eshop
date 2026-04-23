import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PricePipe } from '../../pipes/price.pipe';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [MatButtonModule, PricePipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart-summary.component.html',
})
export class CartSummaryComponent {
  readonly subtotalCzk = input.required<number>();
  readonly shippingCzk = input.required<number>();
  readonly taxCzk = input.required<number>();
  readonly totalCzk = input.required<number>();
}
