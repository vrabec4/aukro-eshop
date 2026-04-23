import { effect, inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { convertFromCzk } from '../constants/exchange-rates.2024-12-31';
import { LANGUAGE_LOCALES, UNIT_LABELS } from '../constants/i18n';
import { CURRENCIES, Currency, DEFAULT_CURRENCY } from '../models/currency.model';
import { DEFAULT_LANGUAGE, Language, LANGUAGES } from '../models/language.model';
import { ProductUnit } from '../models/product.model';

const STORAGE_KEY = 'aukro-eshop:settings:v1';

interface PersistedSettings {
  language: Language;
  currency: Currency;
}

@Injectable({ providedIn: 'root' })
export class SettingsStoreService {
  private readonly translate = inject(TranslateService);
  private readonly initial = loadSettingsFromStorage();
  private readonly _language = signal<Language>(this.initial.language);
  private readonly _currency = signal<Currency>(this.initial.currency);

  readonly language = this._language.asReadonly();
  readonly currency = this._currency.asReadonly();

  constructor() {
    // Keep TranslateService in sync with the language signal. Signal-driven
    // so it fires on initial boot (with the hydrated value from storage)
    // and again on every setLanguage call.
    effect(() => {
      this.translate.use(this._language());
    });

    // Persist any change to the language/currency selection back to
    // localStorage. Effect runs on initial read too, which harmlessly
    // re-writes the loaded values (and self-heals if the previous load
    // fell back to defaults due to corruption).
    effect(() => {
      saveSettingsToStorage({
        language: this._language(),
        currency: this._currency(),
      });
    });
  }

  setLanguage(language: Language): void {
    this._language.set(language);
  }

  setCurrency(currency: Currency): void {
    this._currency.set(currency);
  }

  // --- Formatting helpers -------------------------------------------------
  // UI strings go through the `| translate` pipe in templates; these helpers
  // handle numeric / unit formatting that ngx-translate doesn't cover.

  unit(u: ProductUnit): string {
    return UNIT_LABELS[this._language()][u];
  }

  price(amountCzk: number | null | undefined): string {
    if (amountCzk == null || Number.isNaN(amountCzk)) return '';
    const currency = this._currency();
    const locale = LANGUAGE_LOCALES[this._language()];
    const converted = convertFromCzk(amountCzk, currency);
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(converted);
  }
}

function loadSettingsFromStorage(): PersistedSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults();
    const parsed = JSON.parse(raw) as Partial<PersistedSettings>;
    return {
      // Validate against the allowed enum — someone editing localStorage
      // directly, or a stored value from an older schema, falls back to
      // the default instead of propagating bad state into the app.
      language: LANGUAGES.includes(parsed.language as Language)
        ? (parsed.language as Language)
        : DEFAULT_LANGUAGE,
      currency: CURRENCIES.includes(parsed.currency as Currency)
        ? (parsed.currency as Currency)
        : DEFAULT_CURRENCY,
    };
  } catch {
    // Corrupt JSON, disabled storage, or private mode — start with defaults.
    return defaults();
  }
}

function saveSettingsToStorage(settings: PersistedSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Quota exceeded or disabled storage — selection still works for
    // the session even if we can't persist it.
  }
}

function defaults(): PersistedSettings {
  return { language: DEFAULT_LANGUAGE, currency: DEFAULT_CURRENCY };
}
