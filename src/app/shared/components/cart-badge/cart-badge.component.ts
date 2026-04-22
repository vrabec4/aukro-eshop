import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-cart-badge',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatButtonModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      mat-stroked-button
      routerLink="/cart"
      routerLinkActive="!bg-green-700 !text-white"
      [attr.aria-label]="'openBasket' | translate"
    >
      {{ 'basket' | translate }} ({{ count() }})
    </a>
  `,
})
export class CartBadgeComponent {
  readonly count = input.required<number>();
}
