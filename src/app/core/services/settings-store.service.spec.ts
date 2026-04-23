import { TestBed } from '@angular/core/testing';
import { SettingsStoreService } from './settings-store.service';

describe('SettingsStoreService', () => {
  let service: SettingsStoreService;

  beforeEach(() => {
    // Reset persisted state between tests so one test's selection can't
    // bleed into the next.
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [SettingsStoreService] });
    service = TestBed.inject(SettingsStoreService);
  });

  describe('t()', () => {
    it('returns the value for the current language', () => {
      service.setLanguage('cs');
      expect(service.t('shopTitle')).toBe('Seznam produktů');

      service.setLanguage('en');
      expect(service.t('shopTitle')).toBe('Shoplist');

      service.setLanguage('sk');
      expect(service.t('shopTitle')).toBe('Zoznam produktov');
    });
  });

  describe('unit()', () => {
    it('returns the localized unit label', () => {
      service.setLanguage('cs');
      expect(service.unit('kg')).toBe('kg');
      expect(service.unit('pcs')).toBe('ks');
      expect(service.unit('bundle')).toBe('svazek');
      expect(service.unit('pack')).toBe('balení');

      service.setLanguage('sk');
      expect(service.unit('bundle')).toBe('zväzok');

      service.setLanguage('en');
      expect(service.unit('bundle')).toBe('bundle');
    });
  });

  describe('price()', () => {
    beforeEach(() => {
      service.setLanguage('cs');
      service.setCurrency('CZK');
    });

    it('returns empty string for null/undefined/NaN', () => {
      expect(service.price(null)).toBe('');
      expect(service.price(undefined)).toBe('');
      expect(service.price(Number.NaN)).toBe('');
    });

    it('formats CZK amounts with the cs-CZ locale', () => {
      // 1000 CZK in cs-CZ → "1 000,00 Kč" (narrow-no-break space + Kč suffix).
      const out = service.price(1000);
      expect(out).toMatch(/1\s?000,00\s?Kč/);
    });

    it('converts to EUR using the 2024-12-31 rate', () => {
      service.setCurrency('EUR');
      // 25.185 CZK = 1 EUR, so 2518.5 CZK ≈ 100.00 EUR
      const out = service.price(2518.5);
      expect(out).toMatch(/100[,.]00/);
      expect(out).toMatch(/€|EUR/);
    });

    it('converts to GBP using the 2024-12-31 rate', () => {
      service.setCurrency('GBP');
      // 30.378 CZK = 1 GBP
      const out = service.price(30.378);
      expect(out).toMatch(/1[,.]00/);
      expect(out).toMatch(/£|GBP/);
    });

    it('uses the en-US locale when language is en', () => {
      service.setLanguage('en');
      service.setCurrency('CZK');
      // 1000 CZK in en-US → "CZK 1,000.00" (period decimal, comma thousands).
      expect(service.price(1000)).toMatch(/1,000\.00/);
    });
  });

  describe('persistence', () => {
    it('starts with defaults when localStorage has no prior settings', () => {
      // beforeEach cleared storage, so this mirrors a first-ever visit.
      expect(service.language()).toBe('cs');
      expect(service.currency()).toBe('CZK');
    });

    it('persists language + currency across service instances (simulates a page refresh)', () => {
      service.setLanguage('en');
      service.setCurrency('EUR');
      TestBed.flushEffects();

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [SettingsStoreService] });
      const reloaded = TestBed.inject(SettingsStoreService);

      expect(reloaded.language()).toBe('en');
      expect(reloaded.currency()).toBe('EUR');
    });

    it('falls back to defaults when localStorage contains invalid JSON', () => {
      localStorage.setItem('aukro-eshop:settings:v1', '{not valid json');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [SettingsStoreService] });
      const recovered = TestBed.inject(SettingsStoreService);

      expect(recovered.language()).toBe('cs');
      expect(recovered.currency()).toBe('CZK');
    });

    it('falls back to defaults when stored values are outside the allowed enums', () => {
      // Someone edited localStorage directly, or a stored value from an
      // older schema — the service must not trust raw JSON.
      localStorage.setItem(
        'aukro-eshop:settings:v1',
        JSON.stringify({ language: 'fr', currency: 'JPY' }),
      );

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [SettingsStoreService] });
      const recovered = TestBed.inject(SettingsStoreService);

      expect(recovered.language()).toBe('cs');
      expect(recovered.currency()).toBe('CZK');
    });
  });
});
