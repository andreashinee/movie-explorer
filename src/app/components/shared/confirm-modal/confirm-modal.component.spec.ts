import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ConfirmModalComponent } from './confirm-modal.component';

describe('ConfirmModalComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmModalComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ConfirmModalComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should emit confirmed', () => {
    const fixture = TestBed.createComponent(ConfirmModalComponent);
    const component = fixture.componentInstance;
    spyOn(component.confirmed, 'emit');

    component.confirm();

    expect(component.confirmed.emit).toHaveBeenCalled();
  });

  it('should emit dismissed on cancel', () => {
    const fixture = TestBed.createComponent(ConfirmModalComponent);
    const component = fixture.componentInstance;
    spyOn(component.dismissed, 'emit');

    component.cancel();

    expect(component.dismissed.emit).toHaveBeenCalled();
  });

  it('should display the title input', () => {
    const fixture = TestBed.createComponent(ConfirmModalComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Delete Season');
    expect(component.title()).toBe('Delete Season');
  });

  it('should display the message input', () => {
    const fixture = TestBed.createComponent(ConfirmModalComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('message', 'Are you sure?');
    expect(component.message()).toBe('Are you sure?');
  });

  it('should show default title and message when not provided', () => {
    const fixture = TestBed.createComponent(ConfirmModalComponent);
    const component = fixture.componentInstance;
    expect(component.title()).toBe('Confirm Delete');
    expect(component.message()).toBe('Are you sure?');
  });
});
