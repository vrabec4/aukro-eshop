import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Currency } from './core/models/currency.model';
import { Language } from './core/models/language.model';
import { CartStore } from './core/services/cart-store.service';
import { SettingsStore } from './core/services/settings-store.service';
import { AppHeaderComponent } from './shared/components/app-header/app-header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly settings = inject(SettingsStore);
  private readonly cart = inject(CartStore);

  protected readonly language = this.settings.language;
  protected readonly currency = this.settings.currency;
  protected readonly cartCount = this.cart.count;

  protected setLanguage(language: Language): void {
    this.settings.setLanguage(language);
  }

  protected setCurrency(currency: Currency): void {
    this.settings.setCurrency(currency);
  }
}
