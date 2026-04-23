import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Pagination nav with a mobile-collapsed "X / Y" counter.
 *
 * Style contract: the template references the global .btn-action /
 * .btn-ghost variant classes from src/styles/button-variants.scss.
 * If this component is ever lazy-loaded or extracted into a library,
 * those classes must travel with it.
 */
@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [MatButtonModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly pageChange = output<number>();

  protected readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.page();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i);
    const start = Math.max(0, Math.min(current - 2, total - 5));
    return Array.from({ length: 5 }, (_, i) => start + i);
  });

  protected readonly hasPrev = computed(() => this.page() > 0);
  protected readonly hasNext = computed(() => this.page() < this.totalPages() - 1);

  protected onPage(n: number): void {
    this.pageChange.emit(n);
  }
}
