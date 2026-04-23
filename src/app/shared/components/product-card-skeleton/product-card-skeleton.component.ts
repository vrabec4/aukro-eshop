import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-product-card-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-card-skeleton.component.html',
})
export class ProductCardSkeletonComponent {}
