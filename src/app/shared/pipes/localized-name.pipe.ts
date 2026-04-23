import { inject, Pipe, PipeTransform } from '@angular/core';
import { Language } from '../../core/models/language.model';
import { SettingsStore } from '../../core/services/settings-store.service';

@Pipe({ name: 'localizedName', standalone: true, pure: false })
export class LocalizedNamePipe implements PipeTransform {
  private readonly settings = inject(SettingsStore);

  transform(names: Record<Language, string>): string {
    return names[this.settings.language()];
  }
}
