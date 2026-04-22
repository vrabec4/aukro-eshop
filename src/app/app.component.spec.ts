import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the app header', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('app-header');
    expect(header).not.toBeNull();
  });

  it('should render a router outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const outlet = fixture.nativeElement.querySelector('router-outlet');
    expect(outlet).not.toBeNull();
  });
});
