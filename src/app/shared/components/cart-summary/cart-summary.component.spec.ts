import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TRANSLATIONS } from '../../../core/i18n/translations';
import { SettingsStore } from '../../../core/services/settings-store.service';
import { CartSummaryComponent } from './cart-summary.component';

describe('CartSummaryComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartSummaryComponent, TranslateModule.forRoot()],
      providers: [SettingsStore],
    }).compileComponents();

    // Ensure the translate pipe resolves keys to real Czech strings —
    // the forRoot() wiring is present but has no loader, so we seed it
    // manually.
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('cs', TRANSLATIONS.cs);
    translate.use('cs');
  });

  it('renders subtotal, shipping, tax, and total', () => {
    const fixture = TestBed.createComponent(CartSummaryComponent);

    fixture.componentRef.setInput('subtotalCzk', 124);
    fixture.componentRef.setInput('shippingCzk', 100);
    fixture.componentRef.setInput('taxCzk', 6.2);
    fixture.componentRef.setInput('totalCzk', 230.2);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Mezisoučet');
    expect(text).toContain('Doprava');
    expect(text).toContain('DPH');
    expect(text).toContain('Celkem');
    // PricePipe should render the CZK total in cs-CZ form (narrow-no-break
    // space + "Kč" suffix). Catches the impure-pipe wiring silently regressing.
    expect(text).toMatch(/230,20\s?Kč/);
  });
});
