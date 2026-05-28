import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TreeItemComponent } from './tree-item.component';
import { TreeNode } from '@models/tree-node.model';

function createNode(overrides: Partial<TreeNode> = {}): TreeNode {
  return {
    id: 'test-1',
    name: 'Test Node',
    type: 'title',
    icon: 'tv',
    children: [],
    ...overrides,
  };
}

describe('TreeItemComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeItemComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TreeItemComponent);
    fixture.componentRef.setInput('node', createNode());
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should emit nodeSelected on select', () => {
    const fixture = TestBed.createComponent(TreeItemComponent);
    const component = fixture.componentInstance;
    const node = createNode();
    fixture.componentRef.setInput('node', node);
    spyOn(component.nodeSelected, 'emit');

    component.onSelect();

    expect(component.nodeSelected.emit).toHaveBeenCalledWith(node);
  });

  it('should emit nodeToggled when toggled on a node with children', () => {
    const fixture = TestBed.createComponent(TreeItemComponent);
    const component = fixture.componentInstance;
    const node = createNode({ children: [createNode({ id: 'child-1' })] });
    fixture.componentRef.setInput('node', node);
    spyOn(component.nodeToggled, 'emit');

    const event = new MouseEvent('click');
    component.onToggle(event);

    expect(component.nodeToggled.emit).toHaveBeenCalledWith('test-1');
  });

  it('should not emit nodeToggled when toggled on a leaf node', () => {
    const fixture = TestBed.createComponent(TreeItemComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('node', createNode({ children: [] }));
    spyOn(component.nodeToggled, 'emit');

    const event = new MouseEvent('click');
    component.onToggle(event);

    expect(component.nodeToggled.emit).not.toHaveBeenCalled();
  });

  it('should emit nodeAdd for non-episode nodes', () => {
    const fixture = TestBed.createComponent(TreeItemComponent);
    const component = fixture.componentInstance;
    const node = createNode({ type: 'season' });
    fixture.componentRef.setInput('node', node);
    spyOn(component.nodeAdd, 'emit');

    const event = new MouseEvent('click');
    component.onAdd(event);

    expect(component.nodeAdd.emit).toHaveBeenCalledWith(node);
  });

  it('should not emit nodeAdd for episode nodes', () => {
    const fixture = TestBed.createComponent(TreeItemComponent);
    const component = fixture.componentInstance;
    const node = createNode({ type: 'episode' });
    fixture.componentRef.setInput('node', node);
    spyOn(component.nodeAdd, 'emit');

    const event = new MouseEvent('click');
    component.onAdd(event);

    expect(component.nodeAdd.emit).not.toHaveBeenCalled();
  });

  it('should emit nodeDelete on delete', () => {
    const fixture = TestBed.createComponent(TreeItemComponent);
    const component = fixture.componentInstance;
    const node = createNode();
    fixture.componentRef.setInput('node', node);
    spyOn(component.nodeDelete, 'emit');

    const event = new MouseEvent('click');
    component.onDelete(event);

    expect(component.nodeDelete.emit).toHaveBeenCalledWith('test-1');
  });

  it('should have isExpanded true when searchActive is true', () => {
    const fixture = TestBed.createComponent(TreeItemComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('node', createNode());
    fixture.componentRef.setInput('searchActive', true);

    expect(component.isExpanded).toBeTrue();
  });

  it('should have isExpanded true when id is in expandedIds', () => {
    const fixture = TestBed.createComponent(TreeItemComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('node', createNode());
    fixture.componentRef.setInput('expandedIds', new Set(['test-1']));

    expect(component.isExpanded).toBeTrue();
  });

  it('should have isSelected true when selectedId matches node id', () => {
    const fixture = TestBed.createComponent(TreeItemComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('node', createNode());
    fixture.componentRef.setInput('selectedId', 'test-1');

    expect(component.isSelected).toBeTrue();
  });

  it('should start editing on double click', () => {
    const fixture = TestBed.createComponent(TreeItemComponent);
    const component = fixture.componentInstance;
    const node = createNode({ name: 'Original Name' });
    fixture.componentRef.setInput('node', node);

    const event = new MouseEvent('dblclick');
    component.startEdit(event);

    expect(component.editing).toBeTrue();
    expect(component.editName).toBe('Original Name');
  });

  it('should emit nodeRename on commit with a different name', () => {
    const fixture = TestBed.createComponent(TreeItemComponent);
    const component = fixture.componentInstance;
    const node = createNode({ name: 'Old Name' });
    fixture.componentRef.setInput('node', node);
    spyOn(component.nodeRename, 'emit');

    component.editing = true;
    component.editName = 'New Name';
    component.commitEdit();

    expect(component.nodeRename.emit).toHaveBeenCalledWith({ id: 'test-1', name: 'New Name' });
    expect(component.editing).toBeFalse();
  });

  it('should cancel edit without emitting', () => {
    const fixture = TestBed.createComponent(TreeItemComponent);
    const component = fixture.componentInstance;
    const node = createNode({ name: 'Old Name' });
    fixture.componentRef.setInput('node', node);
    spyOn(component.nodeRename, 'emit');

    component.editing = true;
    component.editName = 'New Name';
    component.cancelEdit();

    expect(component.nodeRename.emit).not.toHaveBeenCalled();
    expect(component.editing).toBeFalse();
  });
});
