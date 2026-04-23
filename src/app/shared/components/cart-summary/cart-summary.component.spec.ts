import { TestBed } from '@angular/core/testing';
import { SettingsStoreService } from '../../../core/services/settings-store.service';
import { CartSummaryComponent } from './cart-summary.component';

describe('CartSummaryComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartSummaryComponent],
      providers: [SettingsStoreService],
    }).compileComponents();
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
  });
});
