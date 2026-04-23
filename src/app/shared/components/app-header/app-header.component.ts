import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Currency } from '../../../core/models/currency.model';
import { Language } from '../../../core/models/language.model';
import { SettingsStoreService } from '../../../core/services/settings-store.service';
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `:host { display: contents; }`,
  template: `
    <header class="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div
        class="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8"
      >
        <nav class="flex items-center gap-2" aria-label="Primary">
          <a
            mat-stroked-button
            class="btn-ghost btn-ghost--pill"
            routerLink="/shop"
            routerLinkActive="btn-ghost--active"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            {{ settings.t('shopList') }}
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
  protected readonly settings = inject(SettingsStoreService);

  readonly language = input.required<Language>();
  readonly currency = input.required<Currency>();
  readonly cartCount = input.required<number>();

  readonly languageChange = output<Language>();
  readonly currencyChange = output<Currency>();
}
