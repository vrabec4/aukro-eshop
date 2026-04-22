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

  it('renders subtotal and total without extra fee rows', () => {
    const fixture = TestBed.createComponent(CartSummaryComponent);

    fixture.componentRef.setInput('subtotalCzk', 124);
    fixture.componentRef.setInput('totalCzk', 124);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Mezisoučet');
    expect(text).toContain('Celkem');
    expect(text).not.toContain('Doprava');
    expect(text).not.toContain('DPH');
  });
});
