import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Currency, CURRENCIES } from '../../../core/models/currency.model';
import { Language, LANGUAGES } from '../../../core/models/language.model';

const FLAG: Record<Language, string> = {
  cs: '/images/flags/cz.png',
  sk: '/images/flags/sk.png',
  en: '/images/flags/gb.png',
};

const LANG_LABEL: Record<Language, string> = {
  cs: 'Čeština',
  sk: 'Slovenčina',
  en: 'English',
};

const CURRENCY_FLAG: Record<Currency, string> = {
  CZK: '/images/flags/cz.png',
  EUR: '/images/flags/eu.png',
  GBP: '/images/flags/gb.png',
};

@Component({
  selector: 'app-language-currency-switcher',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center gap-2">
      <!-- Language picker -->
      <div class="relative">
        <button
          type="button"
          class="flex h-10 cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          (click)="toggleLang()"
          [attr.aria-expanded]="langOpen()"
          aria-haspopup="listbox"
        >
          <img
            [src]="flagForLang()"
            alt=""
            class="h-6 w-6 flex-none rounded-full object-cover ring-1 ring-gray-200"
          />
          <span>{{ labelForLang() }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="h-4 w-4 text-slate-400 transition"
            [class.rotate-180]="langOpen()"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        @if (langOpen()) {
          <div
            role="listbox"
            class="absolute left-0 z-20 mt-2 w-max min-w-full max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg md:left-auto md:right-0 md:max-w-44"
          >
            @for (lang of languages; track lang) {
              <button
                type="button"
                role="option"
                [attr.aria-selected]="lang === language()"
                (click)="selectLang(lang)"
                class="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-gray-100"
                [class.bg-gray-100]="lang === language()"
              >
                <img
                  [src]="flagSrc(lang)"
                  alt=""
                  class="h-6 w-6 flex-none rounded-full object-cover ring-1 ring-gray-200"
                />
                <span>{{ langLabels[lang] }}</span>
              </button>
            }
          </div>
        }
      </div>

      <!-- Currency picker -->
      <div class="relative">
        <button
          type="button"
          class="flex h-10 cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          (click)="toggleCur()"
          [attr.aria-expanded]="curOpen()"
          aria-haspopup="listbox"
        >
          <img
            [src]="flagForCurrency()"
            alt=""
            class="h-6 w-6 flex-none rounded-full object-cover ring-1 ring-gray-200"
          />
          <span>{{ currency() }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="h-4 w-4 text-slate-400 transition"
            [class.rotate-180]="curOpen()"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        @if (curOpen()) {
          <div
            role="listbox"
            class="absolute left-0 z-20 mt-2 w-max min-w-full max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg md:left-auto md:right-0 md:max-w-36"
          >
            @for (cur of currencies; track cur) {
              <button
                type="button"
                role="option"
                [attr.aria-selected]="cur === currency()"
                (click)="selectCur(cur)"
                class="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-gray-100"
                [class.bg-gray-100]="cur === currency()"
              >
                <img
                  [src]="currencyFlagSrc(cur)"
                  alt=""
                  class="h-6 w-6 flex-none rounded-full object-cover ring-1 ring-gray-200"
                />
                <span>{{ cur }}</span>
              </button>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class LanguageCurrencySwitcherComponent {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly language = input.required<Language>();
  readonly currency = input.required<Currency>();
  readonly languageChange = output<Language>();
  readonly currencyChange = output<Currency>();

  readonly languages = LANGUAGES;
  readonly currencies = CURRENCIES;
  readonly langLabels = LANG_LABEL;

  protected readonly langOpen = signal(false);
  protected readonly curOpen = signal(false);

  protected readonly flagForLang = computed(() => FLAG[this.language()]);
  protected readonly labelForLang = computed(() => LANG_LABEL[this.language()]);
  protected readonly flagForCurrency = computed(() => CURRENCY_FLAG[this.currency()]);

  protected flagSrc(lang: Language): string {
    return FLAG[lang];
  }

  protected currencyFlagSrc(cur: Currency): string {
    return CURRENCY_FLAG[cur];
  }

  protected toggleLang(): void {
    this.langOpen.update((v) => !v);
    this.curOpen.set(false);
  }

  protected toggleCur(): void {
    this.curOpen.update((v) => !v);
    this.langOpen.set(false);
  }

  protected selectLang(lang: Language): void {
    this.languageChange.emit(lang);
    this.langOpen.set(false);
  }

  protected selectCur(cur: Currency): void {
    this.currencyChange.emit(cur);
    this.curOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.langOpen.set(false);
      this.curOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.langOpen.set(false);
    this.curOpen.set(false);
  }
}
