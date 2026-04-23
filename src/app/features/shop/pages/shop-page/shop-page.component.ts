import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UI_LABELS } from '../../../../core/constants/i18n';
import { PAGE_SIZE_OPTIONS } from '../../../../core/constants/offer-ids';
import { Product } from '../../../../core/models/product.model';
import { CartStoreService } from '../../../../core/services/cart-store.service';
import { CatalogService } from '../../../../core/services/catalog.service';
import { SettingsStoreService } from '../../../../core/services/settings-store.service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { PaginationComponent } from '../../../../shared/ui/pagination/pagination.component';
import { ProductCardSkeletonComponent } from '../../../../shared/ui/product-card-skeleton/product-card-skeleton.component';
import { ProductCardComponent } from '../../../../shared/ui/product-card/product-card.component';

@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslatePipe,
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
  private readonly settings = inject(SettingsStoreService);
  private readonly snackBar = inject(MatSnackBar);

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
    const lang = this.settings.language();
    this.snackBar.open(UI_LABELS[lang].addedToBasket, UI_LABELS[lang].dismiss, {
      duration: 2500,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
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
