import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CartStore } from '../../../../core/services/cart-store.service';
import { CartItemRowComponent } from '../../../../shared/components/cart-item-row/cart-item-row.component';
import { CartSummaryComponent } from '../../../../shared/components/cart-summary/cart-summary.component';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [RouterLink, TranslateModule, CartItemRowComponent, CartSummaryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart-page.component.html',
})
export class CartPageComponent {
  private readonly cart = inject(CartStore);

  protected readonly count = this.cart.count;
  protected readonly lines = this.cart.lines;
  protected readonly subtotalCzk = this.cart.subtotalCzk;
  protected readonly shippingCzk = this.cart.shippingCzk;
  protected readonly taxCzk = this.cart.taxCzk;
  protected readonly totalCzk = this.cart.totalCzk;

  protected onRemove(productId: string): void {
    this.cart.remove(productId);
  }
}
