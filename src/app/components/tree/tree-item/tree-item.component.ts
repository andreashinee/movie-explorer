import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TreeNode } from '@models/tree-node.model';

@Component({
  selector: 'app-tree-item',
  standalone: true,
  imports: [TreeItemComponent],
  templateUrl: './tree-item.component.html',
  styleUrl: './tree-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeItemComponent {
  readonly node = input.required<TreeNode>();
  readonly depth = input(0);
  readonly expandedIds = input<Set<string>>(new Set());
  readonly selectedId = input<string | null>(null);
  readonly searchActive = input(false);
  readonly editMode = input(false);

  readonly nodeSelected = output<TreeNode>();
  readonly nodeToggled = output<string>();
  readonly nodeAdd = output<TreeNode>();
  readonly nodeDelete = output<string>();
  readonly nodeRename = output<{ id: string; name: string }>();

  editing = false;
  editName = '';

  get hasChildren(): boolean {
    return (this.node().children?.length ?? 0) > 0;
  }

  get isExpanded(): boolean {
    return this.searchActive() || this.expandedIds().has(this.node().id);
  }

  get isSelected(): boolean {
    return this.selectedId() === this.node().id;
  }

  onSelect(): void {
    this.nodeSelected.emit(this.node());
  }

  onToggle(event: Event): void {
    event.stopPropagation();
    if (this.hasChildren) {
      this.nodeToggled.emit(this.node().id);
    }
  }

  onAdd(event: Event): void {
    event.stopPropagation();
    if (this.node().type !== 'episode') {
      this.nodeAdd.emit(this.node());
    }
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.nodeDelete.emit(this.node().id);
  }

  startEdit(event: Event): void {
    event.stopPropagation();
    this.editing = true;
    this.editName = this.node().name;
  }

  commitEdit(): void {
    const name = this.editName?.trim();
    if (name && name !== this.node().name) {
      this.nodeRename.emit({ id: this.node().id, name });
    }
    this.editing = false;
  }

  cancelEdit(): void {
    this.editing = false;
  }

  trackById(_: number, child: TreeNode): string {
    return child.id;
  }
}
