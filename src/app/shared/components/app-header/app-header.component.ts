import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Currency } from '../../../core/models/currency.model';
import { Language } from '../../../core/models/language.model';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { CartBadgeComponent } from '../cart-badge/cart-badge.component';
import { LanguageCurrencySwitcherComponent } from '../language-currency-switcher/language-currency-switcher.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    CartBadgeComponent,
    LanguageCurrencySwitcherComponent,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="border-b border-gray-200 bg-white">
      <div class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <nav class="flex items-center gap-2" aria-label="Primary">
          <a
            mat-stroked-button
            routerLink="/shop"
            routerLinkActive="!bg-green-700 !text-white"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            {{ 'shopList' | translate }}
          </a>
          <app-cart-badge [count]="cartCount()" />
        </nav>

        <app-language-currency-switcher
          [language]="language()"
          [currency]="currency()"
          (languageChange)="languageChange.emit($event)"
          (currencyChange)="currencyChange.emit($event)"
        />
      </div>
    </header>
  `,
})
export class AppHeaderComponent {
  readonly language = input.required<Language>();
  readonly currency = input.required<Currency>();
  readonly cartCount = input.required<number>();

  readonly languageChange = output<Language>();
  readonly currencyChange = output<Currency>();
}
