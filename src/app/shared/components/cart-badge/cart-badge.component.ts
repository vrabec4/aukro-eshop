import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cart-badge',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      mat-stroked-button
      routerLink="/cart"
      routerLinkActive="!bg-green-700 !text-white"
      aria-label="Open basket"
    >
      Basket ({{ count() }})
    </a>
  `,
})
export class CartBadgeComponent {
  readonly count = input.required<number>();
}
