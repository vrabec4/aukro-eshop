import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStoreService } from '../../../../core/services/cart-store.service';
import { SettingsStoreService } from '../../../../core/services/settings-store.service';
import { CartItemRowComponent } from '../../../../shared/components/cart-item-row/cart-item-row.component';
import { CartSummaryComponent } from '../../../../shared/components/cart-summary/cart-summary.component';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [RouterLink, CartItemRowComponent, CartSummaryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart-page.component.html',
})
export class CartPageComponent {
  private readonly cart = inject(CartStoreService);
  protected readonly settings = inject(SettingsStoreService);

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
