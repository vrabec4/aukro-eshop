import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-5xl px-4 py-6">
      <h1 class="mb-4 text-3xl font-serif">Basket</h1>
      <p class="text-gray-500">Cart items and order summary render here in Phase 7.</p>
    </section>
  `,
})
export class CartPageComponent {}
