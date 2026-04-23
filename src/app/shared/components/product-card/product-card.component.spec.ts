import { TestBed } from '@angular/core/testing';
import { Product } from '../../../core/models/product.model';
import { SettingsStoreService } from '../../../core/services/settings-store.service';
import { ProductCardComponent } from './product-card.component';

describe('ProductCardComponent', () => {
  const product: Product = {
    id: 'test-1',
    name: {
      cs: 'Heirloom rajce',
      sk: 'Heirloom paradajka',
      en: 'Heirloom tomato',
    },
    images: {
      thumb: 'https://example.com/tomato-73.jpg',
      card: 'https://example.com/tomato-400.jpg',
      full: 'https://example.com/tomato-730.jpg',
    },
    unit: 'kg',
    quantity: 0.5,
    basePriceCzk: 89,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [SettingsStoreService],
    }).compileComponents();
  });

  it('renders the localized product name and price per unit', () => {
    const fixture = TestBed.createComponent(ProductCardComponent);
    const settings = TestBed.inject(SettingsStoreService);

    settings.setLanguage('en');
    fixture.componentRef.setInput('product', product);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Heirloom tomato');
    expect(text).toContain('178.00');
  });

  it('emits addToCart when the CTA is clicked', () => {
    const fixture = TestBed.createComponent(ProductCardComponent);
    const emitSpy = jest.fn();

    fixture.componentRef.setInput('product', product);
    fixture.componentInstance.addToCart.subscribe(emitSpy);
    fixture.detectChanges();

    const cta = fixture.nativeElement.querySelector('button.btn-action') as HTMLButtonElement;
    cta.click();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});
