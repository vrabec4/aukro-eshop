import { Injectable, signal } from '@angular/core';
import { convertFromCzk } from '../constants/exchange-rates.2024-12-31';
import { LANGUAGE_LOCALES, UI_LABELS, UiKey, UNIT_LABELS } from '../constants/i18n';
import { Currency, DEFAULT_CURRENCY } from '../models/currency.model';
import { DEFAULT_LANGUAGE, Language } from '../models/language.model';
import { ProductUnit } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class SettingsStoreService {
  private readonly _language = signal<Language>(DEFAULT_LANGUAGE);
  private readonly _currency = signal<Currency>(DEFAULT_CURRENCY);

  readonly language = this._language.asReadonly();
  readonly currency = this._currency.asReadonly();

  setLanguage(language: Language): void {
    this._language.set(language);
  }

  setCurrency(currency: Currency): void {
    this._currency.set(currency);
  }

  // --- Template helpers ---------------------------------------------------
  // Called directly from templates (e.g. `{{ settings.t('shopTitle') }}`).
  // Each one reads the language/currency signal, so Angular's template
  // reactive context re-evaluates the expression whenever the signal
  // changes — no pipes, no `pure: false`, no CD-tick re-runs.

  t(key: UiKey): string {
    return UI_LABELS[this._language()][key];
  }

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
