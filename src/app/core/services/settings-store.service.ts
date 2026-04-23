import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import { convertFromCzk } from '../constants/exchange-rates.2024-12-31';
import { LANGUAGE_LOCALES, UNIT_LABELS } from '../constants/i18n';
import { CURRENCIES, Currency, DEFAULT_CURRENCY } from '../models/currency.model';
import { DEFAULT_LANGUAGE, Language, LANGUAGES } from '../models/language.model';
import { ProductUnit } from '../models/product.model';

const STORAGE_KEY = 'aukro-eshop:settings:v1';

interface SettingsState {
  language: Language;
  currency: Currency;
}

export const SettingsStore = signalStore(
  { providedIn: 'root' },
  withState<SettingsState>(() => loadSettingsFromStorage()),
  withMethods((store) => {
    const translate = inject(TranslateService);
    return {
      setLanguage(language: Language): void {
        patchState(store, { language });
        translate.use(language);
        saveSettingsToStorage({ language, currency: store.currency() });
      },
      setCurrency(currency: Currency): void {
        patchState(store, { currency });
        saveSettingsToStorage({ language: store.language(), currency });
      },
      unit(u: ProductUnit): string {
        return UNIT_LABELS[store.language()][u];
      },
      price(amountCzk: number | null | undefined): string {
        if (amountCzk == null || Number.isNaN(amountCzk)) return '';
        const currency = store.currency();
        const locale = LANGUAGE_LOCALES[store.language()];
        const converted = convertFromCzk(amountCzk, currency);
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency,
          maximumFractionDigits: 2,
        }).format(converted);
      },
    };
  }),
  withHooks({
    onInit(store) {
      // Hydrate ngx-translate with whatever language we loaded from storage
      // so the first render picks the right dictionary.
      inject(TranslateService).use(store.language());
    },
  }),
);

export type SettingsStore = InstanceType<typeof SettingsStore>;

function loadSettingsFromStorage(): SettingsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults();
    const parsed = JSON.parse(raw) as Partial<SettingsState>;
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

function saveSettingsToStorage(settings: SettingsState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Quota exceeded or disabled storage — selection still works for
    // the session even if we can't persist it.
  }
}

function defaults(): SettingsState {
  return { language: DEFAULT_LANGUAGE, currency: DEFAULT_CURRENCY };
}
