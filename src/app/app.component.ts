import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Currency, DEFAULT_CURRENCY } from './core/models/currency.model';
import { DEFAULT_LANGUAGE, Language } from './core/models/language.model';
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
  // Phase 2 stub state. Phase 3 replaces these with SettingsStoreService + CartStoreService.
  protected readonly language = signal<Language>(DEFAULT_LANGUAGE);
  protected readonly currency = signal<Currency>(DEFAULT_CURRENCY);
  protected readonly cartCount = signal(0);

  protected setLanguage(lang: Language): void {
    this.language.set(lang);
  }

  protected setCurrency(cur: Currency): void {
    this.currency.set(cur);
  }
}
