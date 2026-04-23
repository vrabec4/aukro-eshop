import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UI_LABELS } from '../constants/i18n';
import { SettingsStoreService } from './settings-store.service';

/**
 * Centralizes UI feedback for cart actions (toasts, etc.) so that:
 *   - CartStoreService stays domain-only (no MatSnackBar dep, no
 *     SettingsStoreService dep for i18n).
 *   - Shop page stays thin — no inline snackbar configuration.
 *   - Any future add-to-cart entry point (cart-page "move to basket",
 *     quick-add in header, etc.) gets consistent feedback automatically.
 */
@Injectable({ providedIn: 'root' })
export class CartFeedbackService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly settings = inject(SettingsStoreService);

  confirmAdded(): void {
    const lang = this.settings.language();
    this.snackBar.open(UI_LABELS[lang].addedToBasket, UI_LABELS[lang].dismiss, {
      duration: 2500,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
