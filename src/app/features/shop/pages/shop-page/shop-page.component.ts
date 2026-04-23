import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PAGE_SIZE_OPTIONS } from '../../../../core/constants/pagination';
import { Product } from '../../../../core/models/product.model';
import { CartFeedbackService } from '../../../../core/services/cart-feedback.service';
import { CartStoreService } from '../../../../core/services/cart-store.service';
import { CatalogService } from '../../../../core/services/catalog.service';
import { SettingsStoreService } from '../../../../core/services/settings-store.service';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ProductCardSkeletonComponent } from '../../../../shared/components/product-card-skeleton/product-card-skeleton.component';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [
    PaginationComponent,
    ProductCardComponent,
    ProductCardSkeletonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shop-page.component.html',
})
export class ShopPageComponent {
  private readonly catalog = inject(CatalogService);
  private readonly cart = inject(CartStoreService);
  private readonly cartFeedback = inject(CartFeedbackService);
  protected readonly settings = inject(SettingsStoreService);

  protected readonly products = this.catalog.products;
  protected readonly loading = this.catalog.loading;
  protected readonly error = this.catalog.error;
  protected readonly page = this.catalog.page;
  protected readonly pageSize = this.catalog.pageSize;
  protected readonly totalPages = this.catalog.totalPages;
  protected readonly totalElements = this.catalog.totalElements;
  protected readonly pageSizeOptions = PAGE_SIZE_OPTIONS;
  // Render one skeleton per slot so the grid layout lands at full size
  // immediately and doesn't reflow when the real products arrive.
  protected readonly skeletonSlots = computed(() =>
    Array.from({ length: this.pageSize() }, (_, i) => i),
  );

  protected onAddToCart(product: Product, amount: number): void {
    this.cart.add(product, amount);
    this.cartFeedback.confirmAdded();
  }

  protected onPageChange(page: number): void {
    this.catalog.setPage(page);
  }

  protected onPageSizeChange(size: number): void {
    this.catalog.setPageSize(size);
  }

  protected onRetry(): void {
    this.catalog.retry();
  }
}
