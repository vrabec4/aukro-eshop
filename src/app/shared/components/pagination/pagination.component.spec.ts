import { TestBed } from '@angular/core/testing';
import { SettingsStoreService } from '../../../core/services/settings-store.service';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
      providers: [SettingsStoreService],
    }).compileComponents();
  });

  function render(page: number, totalPages: number) {
    const fixture = TestBed.createComponent(PaginationComponent);
    fixture.componentRef.setInput('page', page);
    fixture.componentRef.setInput('totalPages', totalPages);
    fixture.detectChanges();
    return fixture;
  }

  function pageNumberLabels(el: HTMLElement): string[] {
    return [...el.querySelectorAll('button')]
      .map((b) => b.textContent?.trim() ?? '')
      .filter((t) => /^\d+$/.test(t));
  }

  it('shows every page when total is 7 or fewer', () => {
    const fixture = render(0, 5);
    expect(pageNumberLabels(fixture.nativeElement)).toEqual(['1', '2', '3', '4', '5']);
  });

  it('shows a sliding window of 5 around the current page when total exceeds 7', () => {
    const fixture = render(4, 12); // current is page index 4 -> label "5"
    expect(pageNumberLabels(fixture.nativeElement)).toEqual(['3', '4', '5', '6', '7']);
  });

  it('clamps the window at the start when current page is near 0', () => {
    const fixture = render(0, 12);
    expect(pageNumberLabels(fixture.nativeElement)).toEqual(['1', '2', '3', '4', '5']);
  });

  it('clamps the window at the end when current page is near the last page', () => {
    const fixture = render(11, 12); // total 12 -> last index 11
    expect(pageNumberLabels(fixture.nativeElement)).toEqual(['8', '9', '10', '11', '12']);
  });

  it('disables the previous button on the first page', () => {
    const fixture = render(0, 5);
    const prev = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(prev.disabled).toBe(true);
  });

  it('marks the active page button with aria-current="page"', () => {
    const fixture = render(2, 5);
    const current = fixture.nativeElement.querySelector('button[aria-current="page"]') as HTMLButtonElement;
    expect(current).not.toBeNull();
    expect(current.textContent?.trim()).toBe('3');
    const others = [...fixture.nativeElement.querySelectorAll('button')]
      .filter((b) => b !== current && /^\d+$/.test(b.textContent?.trim() ?? ''));
    for (const b of others) expect(b.getAttribute('aria-current')).toBeNull();
  });

  it('disables the next button on the last page', () => {
    const fixture = render(4, 5);
    const buttons = [...fixture.nativeElement.querySelectorAll('button')] as HTMLButtonElement[];
    const next = buttons[buttons.length - 1];
    expect(next.disabled).toBe(true);
  });

  it('emits pageChange with the target index when a page number is clicked', () => {
    const fixture = render(0, 5);
    const spy = jest.fn();
    fixture.componentInstance.pageChange.subscribe(spy);

    const buttons = [...fixture.nativeElement.querySelectorAll('button')] as HTMLButtonElement[];
    const page3Btn = buttons.find((b) => b.textContent?.trim() === '3');
    page3Btn?.click();

    expect(spy).toHaveBeenCalledWith(2); // "3" is index 2
  });

  it('emits pageChange(page-1) when prev is clicked', () => {
    const fixture = render(3, 5);
    const spy = jest.fn();
    fixture.componentInstance.pageChange.subscribe(spy);

    const prev = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    prev.click();

    expect(spy).toHaveBeenCalledWith(2);
  });
});
