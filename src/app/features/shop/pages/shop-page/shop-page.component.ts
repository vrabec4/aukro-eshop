import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { PAGE_SIZE_OPTIONS } from '../../../../core/constants/offer-ids';
import { Product } from '../../../../core/models/product.model';
import { CartStoreService } from '../../../../core/services/cart-store.service';
import { CatalogService } from '../../../../core/services/catalog.service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { PaginationComponent } from '../../../../shared/ui/pagination/pagination.component';
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shop-page.component.html',
})
export class ShopPageComponent {
  private readonly catalog = inject(CatalogService);
  private readonly cart = inject(CartStoreService);

  protected readonly products = this.catalog.products;
  protected readonly loading = this.catalog.loading;
  protected readonly page = this.catalog.page;
  protected readonly pageSize = this.catalog.pageSize;
  protected readonly totalPages = this.catalog.totalPages;
  protected readonly totalElements = this.catalog.totalElements;
  protected readonly pageSizeOptions = PAGE_SIZE_OPTIONS;

  protected onAddToCart(product: Product, amount: number): void {
    this.cart.add(product.id, amount);
  }

  protected onPageChange(page: number): void {
    this.catalog.setPage(page);
  }

  protected onPageSizeChange(size: number): void {
    this.catalog.setPageSize(size);
  }
}
