import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-5xl px-4 py-6">
      <h1 class="mb-4 font-serif text-3xl">{{ 'basketTitle' | translate }}</h1>
      <p class="text-gray-500">{{ 'emptyCart' | translate }}</p>
    </section>
  `,
})
export class CartPageComponent {}
