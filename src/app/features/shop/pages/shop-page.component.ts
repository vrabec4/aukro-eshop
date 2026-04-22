import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-shop-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-5xl px-4 py-6">
      <h1 class="mb-4 text-3xl font-serif">Shoplist</h1>
      <p class="text-gray-500">Product grid will render here in Phase 6.</p>
    </section>
  `,
})
export class ShopPageComponent {}
