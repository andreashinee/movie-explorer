import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavbarComponent } from '@components/navbar/navbar.component';

describe('NavbarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the app header', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.app-header')).toBeTruthy();
  });

  it('should display the total node count', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.node-count-badge') as HTMLElement;
    expect(badge).toBeTruthy();
    expect(badge.textContent).toContain('nodes');
  });
});
