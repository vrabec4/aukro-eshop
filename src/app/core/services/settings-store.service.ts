import { Injectable, signal } from '@angular/core';
import { Currency, DEFAULT_CURRENCY } from '../models/currency.model';
import { DEFAULT_LANGUAGE, Language } from '../models/language.model';

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
}
