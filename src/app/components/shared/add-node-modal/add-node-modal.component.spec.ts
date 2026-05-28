import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AddNodeModalComponent } from './add-node-modal.component';

describe('AddNodeModalComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNodeModalComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AddNodeModalComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should emit confirmed with name and description', () => {
    const fixture = TestBed.createComponent(AddNodeModalComponent);
    const component = fixture.componentInstance;
    spyOn(component.confirmed, 'emit');

    component.nodeName = 'Test Item';
    component.nodeDescription = 'A description';
    component.confirm();

    expect(component.confirmed.emit).toHaveBeenCalledWith({
      name: 'Test Item',
      description: 'A description',
      number: undefined,
      icon: 'assignment_returned',
    });
  });

  it('should not emit confirmed when name is empty', () => {
    const fixture = TestBed.createComponent(AddNodeModalComponent);
    const component = fixture.componentInstance;
    spyOn(component.confirmed, 'emit');

    component.nodeName = '';
    component.confirm();

    expect(component.confirmed.emit).not.toHaveBeenCalled();
  });

  it('should emit dismissed on cancel', () => {
    const fixture = TestBed.createComponent(AddNodeModalComponent);
    const component = fixture.componentInstance;
    spyOn(component.dismissed, 'emit');

    component.cancel();

    expect(component.dismissed.emit).toHaveBeenCalled();
  });

  it('should display the correct title for title type', () => {
    const fixture = TestBed.createComponent(AddNodeModalComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('nodeType', 'title');
    expect(component.title).toBe('Add Title');
  });

  it('should display the correct title for season type', () => {
    const fixture = TestBed.createComponent(AddNodeModalComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('nodeType', 'season');
    expect(component.title).toBe('Add Season');
  });

  it('should display the correct title for episode type', () => {
    const fixture = TestBed.createComponent(AddNodeModalComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('nodeType', 'episode');
    expect(component.title).toBe('Add Episode');
  });
});
