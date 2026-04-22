import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Currency, CURRENCIES } from '../../../core/models/currency.model';
import { Language, LANGUAGES } from '../../../core/models/language.model';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-language-currency-switcher',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <mat-form-field appearance="outline" subscriptSizing="dynamic" class="w-32">
        <mat-label>{{ 'language' | translate }}</mat-label>
        <mat-select
          [ngModel]="language()"
          (ngModelChange)="languageChange.emit($event)"
          [attr.aria-label]="'language' | translate"
        >
          @for (lang of languages; track lang) {
            <mat-option [value]="lang">{{ lang.toUpperCase() }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" subscriptSizing="dynamic" class="w-32">
        <mat-label>{{ 'currency' | translate }}</mat-label>
        <mat-select
          [ngModel]="currency()"
          (ngModelChange)="currencyChange.emit($event)"
          [attr.aria-label]="'currency' | translate"
        >
          @for (cur of currencies; track cur) {
            <mat-option [value]="cur">{{ cur }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </div>
  `,
})
export class LanguageCurrencySwitcherComponent {
  readonly language = input.required<Language>();
  readonly currency = input.required<Currency>();
  readonly languageChange = output<Language>();
  readonly currencyChange = output<Currency>();

  readonly languages = LANGUAGES;
  readonly currencies = CURRENCIES;
}
