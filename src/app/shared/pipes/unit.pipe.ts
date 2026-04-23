import { inject, Pipe, PipeTransform } from '@angular/core';
import { ProductUnit } from '../../core/models/product.model';
import { SettingsStore } from '../../core/services/settings-store.service';

@Pipe({ name: 'unit', standalone: true, pure: false })
export class UnitPipe implements PipeTransform {
  private readonly settings = inject(SettingsStore);

  transform(unit: ProductUnit): string {
    return this.settings.unit(unit);
  }
}
