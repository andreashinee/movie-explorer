import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TreePanelComponent } from './tree-panel.component';
import { EditorStateService } from '@services/editor-state.service';

describe('TreePanelComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreePanelComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TreePanelComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the tree panel', () => {
    const fixture = TestBed.createComponent(TreePanelComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.tree-panel')).toBeTruthy();
  });

  it('should have expandedIds after construction', () => {
    const fixture = TestBed.createComponent(TreePanelComponent);
    expect(fixture.componentInstance.expandedIds().size).toBeGreaterThan(0);
  });

  it('should toggle expandedIds', () => {
    const fixture = TestBed.createComponent(TreePanelComponent);
    const component = fixture.componentInstance;

    const id = 'anything';
    expect(component.expandedIds().has(id)).toBeFalse();

    component.onToggle(id);
    expect(component.expandedIds().has(id)).toBeTrue();

    component.onToggle(id);
    expect(component.expandedIds().has(id)).toBeFalse();
  });

  it('should update searchQuery on search', () => {
    const fixture = TestBed.createComponent(TreePanelComponent);
    const component = fixture.componentInstance;

    component.onSearch('test');
    expect(component.searchQuery()).toBe('test');
  });

  it('should clear searchQuery', () => {
    const fixture = TestBed.createComponent(TreePanelComponent);
    const component = fixture.componentInstance;

    component.onSearch('test');
    component.clearSearch();
    expect(component.searchQuery()).toBe('');
  });

  it('should set selectedNode on select', () => {
    const fixture = TestBed.createComponent(TreePanelComponent);
    const component = fixture.componentInstance;
    const node = component.service.tree()[0];

    const editorState = fixture.debugElement.injector.get(EditorStateService);
    component.onSelect(node);
    expect(editorState.selectedNode()).toBe(node);
  });

  it('should show modal when adding child to a valid parent', () => {
    const fixture = TestBed.createComponent(TreePanelComponent);
    const component = fixture.componentInstance;
    const parent = component.service.tree()[0];

    component.onAdd(parent);
    expect(component.showModal()).toBeTrue();
  });

  it('should not show modal when adding to an episode', () => {
    const fixture = TestBed.createComponent(TreePanelComponent);
    const component = fixture.componentInstance;
    const episode = component.service.tree()[0].children[0]?.children[0];

    if (episode) {
      component.onAdd(episode);
      expect(component.showModal()).toBeFalse();
    }
  });

  it('should show confirm dialog on delete', () => {
    const fixture = TestBed.createComponent(TreePanelComponent);
    const component = fixture.componentInstance;
    const node = component.service.tree()[0];

    component.onDelete(node.id);
    expect(component.showConfirm()).toBeTrue();
    expect(component.confirmMessage()).toContain(node.name);
  });

  it('should close modal on dismiss', () => {
    const fixture = TestBed.createComponent(TreePanelComponent);
    const component = fixture.componentInstance;

    component.showModal.set(true);
    component.onAddDismissed();
    expect(component.showModal()).toBeFalse();
  });
});
