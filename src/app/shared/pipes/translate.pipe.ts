import { inject, Pipe, PipeTransform } from '@angular/core';
import { UI_LABELS, UiKey } from '../../core/constants/i18n';
import { SettingsStoreService } from '../../core/services/settings-store.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private readonly settings = inject(SettingsStoreService);

  transform(key: UiKey): string {
    return UI_LABELS[this.settings.language()][key];
  }
}
