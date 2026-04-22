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
    <section class="mx-auto max-w-5xl px-4 py-6">
      <div class="mb-6 flex items-baseline gap-3 border-b border-gray-200 pb-4">
        <h1 class="font-serif text-3xl">{{ 'shopTitle' | translate }}</h1>
        <span class="text-sm text-gray-500">
          {{ products().length }} {{ 'itemsSuffix' | translate }}
        </span>
      </div>

      @if (loading()) {
        <p class="text-gray-500">{{ 'loading' | translate }}</p>
      } @else if (products().length === 0) {
        <p class="text-gray-500">{{ 'emptyShop' | translate }}</p>
      } @else {
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          @for (product of products(); track product.id) {
            <app-product-card
              [product]="product"
              (addToCart)="onAddToCart(product)"
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

  protected onAddToCart(product: Product): void {
    this.cart.add(product.id, 1);
  }
}
