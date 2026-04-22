import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { CartStoreService } from '../../../core/services/cart-store.service';
import { CatalogService } from '../../../core/services/catalog.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { ProductCardComponent } from '../../../shared/ui/product-card/product-card.component';

@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [TranslatePipe, ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 class="mb-6 text-3xl font-medium text-slate-800">
        {{ 'shopTitle' | translate }}
        <span class="ml-2 text-sm text-indigo-500">
          {{ products().length }} {{ 'itemsSuffix' | translate }}
        </span>
      </h1>

      @if (loading()) {
        <p class="text-gray-500">{{ 'loading' | translate }}</p>
      } @else if (products().length === 0) {
        <p class="text-gray-500">{{ 'emptyShop' | translate }}</p>
      } @else {
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          @for (product of products(); track product.id) {
            <app-product-card
              [product]="product"
              (addToCart)="onAddToCart(product, $event)"
            />
          }
        </div>
      }
    </section>
  `,
})
export class ShopPageComponent {
  private readonly catalog = inject(CatalogService);
  private readonly cart = inject(CartStoreService);

  protected readonly products = this.catalog.products;
  protected readonly loading = this.catalog.loading;

  protected onAddToCart(product: Product, amount: number): void {
    this.cart.add(product.id, amount);
  }
}
