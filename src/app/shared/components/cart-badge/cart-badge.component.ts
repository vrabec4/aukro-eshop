import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { SettingsStoreService } from '../../../core/services/settings-store.service';

@Component({
  selector: 'app-cart-badge',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      mat-stroked-button
      class="btn-ghost btn-ghost--pill"
      routerLink="/cart"
      routerLinkActive="btn-ghost--active"
      [attr.aria-label]="settings.t('openBasket')"
    >
      {{ settings.t('basket') }} ({{ count() }})
    </a>
  `,
})
export class CartBadgeComponent {
  protected readonly settings = inject(SettingsStoreService);

  readonly count = input.required<number>();
}
