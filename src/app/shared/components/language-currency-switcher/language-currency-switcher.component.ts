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
  templateUrl: './language-currency-switcher.component.html',
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
