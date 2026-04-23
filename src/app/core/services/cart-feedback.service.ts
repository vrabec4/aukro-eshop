import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsStoreService } from './settings-store.service';

/**
 * Centralizes UI feedback for cart actions (toasts, etc.) so that:
 *   - CartStoreService stays domain-only (no MatSnackBar dep).
 *   - Shop page stays thin — no inline snackbar configuration.
 *   - Any future add-to-cart entry point (cart-page "move to basket",
 *     quick-add in header, etc.) gets consistent feedback automatically.
 */
@Injectable({ providedIn: 'root' })
export class CartFeedbackService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly settings = inject(SettingsStoreService);

  confirmAdded(): void {
    this.snackBar.open(
      this.settings.t('addedToBasket'),
      this.settings.t('dismiss'),
      {
        duration: 2500,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      },
    );
  }
}
