import { inject, Pipe, PipeTransform } from '@angular/core';
import { UNIT_LABELS } from '../../core/constants/i18n';
import { ProductUnit } from '../../core/models/product.model';
import { SettingsStoreService } from '../../core/services/settings-store.service';

@Pipe({
  name: 'unit',
  standalone: true,
  pure: false,
})
export class UnitPipe implements PipeTransform {
  private readonly settings = inject(SettingsStoreService);

  transform(unit: ProductUnit): string {
    return UNIT_LABELS[this.settings.language()][unit];
  }
}
