import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsStore } from '../../../core/services/settings-store.service';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [MatButtonModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart-summary.component.html',
})
export class CartSummaryComponent {
  protected readonly settings = inject(SettingsStore);

  readonly subtotalCzk = input.required<number>();
  readonly shippingCzk = input.required<number>();
  readonly taxCzk = input.required<number>();
  readonly totalCzk = input.required<number>();
}
