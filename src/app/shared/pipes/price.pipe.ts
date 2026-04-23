import { inject, Pipe, PipeTransform } from '@angular/core';
import { SettingsStore } from '../../core/services/settings-store.service';

// Impure so language/currency changes re-render the pipe output. The
// template reads settings.language() / settings.currency() transitively
// via SettingsStore.price(), so Angular's signal tracking re-evaluates
// the owning template when either signal flips.
@Pipe({ name: 'price', standalone: true, pure: false })
export class PricePipe implements PipeTransform {
  private readonly settings = inject(SettingsStore);

  transform(amountCzk: number | null | undefined): string {
    return this.settings.price(amountCzk);
  }
}
