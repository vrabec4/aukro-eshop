import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

/**
 * Centralizes UI feedback for cart actions (toasts, etc.) so that:
 *   - CartStore stays domain-only (no MatSnackBar dep).
 *   - Shop page stays thin — no inline snackbar configuration.
 *   - Any future add-to-cart entry point (cart-page "move to basket",
 *     quick-add in header, etc.) gets consistent feedback automatically.
 */
@Injectable({ providedIn: 'root' })
export class CartFeedbackService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  confirmAdded(): void {
    this.snackBar.open(
      this.translate.instant('addedToBasket'),
      this.translate.instant('dismiss'),
      {
        duration: 2500,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      },
    );
  }
}
