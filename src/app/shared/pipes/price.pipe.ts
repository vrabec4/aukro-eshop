import { inject, Pipe, PipeTransform } from '@angular/core';
import { convertFromCzk } from '../../core/constants/exchange-rates.2024-12-31';
import { LANGUAGE_LOCALES } from '../../core/constants/i18n';
import { SettingsStoreService } from '../../core/services/settings-store.service';

@Pipe({
  name: 'price',
  standalone: true,
  pure: false,
})
export class PricePipe implements PipeTransform {
  private readonly settings = inject(SettingsStoreService);

  transform(amountCzk: number | null | undefined): string {
    if (amountCzk == null || Number.isNaN(amountCzk)) {
      return '';
    }
    const currency = this.settings.currency();
    const locale = LANGUAGE_LOCALES[this.settings.language()];
    const converted = convertFromCzk(amountCzk, currency);
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(converted);
  }
}
