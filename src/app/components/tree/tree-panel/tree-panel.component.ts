import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovieTreeService } from '@services/movie-tree.service';
import { EditorStateService } from '@services/editor-state.service';
import { TreeNode } from '@models/tree-node.model';
import { TreeItemComponent } from '@components/tree/tree-item/tree-item.component';
import { AddNodeModalComponent, AddNodeResult } from '@components/shared/add-node-modal/add-node-modal.component';
import { ConfirmModalComponent } from '@components/shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-tree-panel',
  standalone: true,
  imports: [FormsModule, TreeItemComponent, AddNodeModalComponent, ConfirmModalComponent],
  templateUrl: './tree-panel.component.html',
  styleUrl: './tree-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreePanelComponent {
  service = inject(MovieTreeService);
  editorState = inject(EditorStateService);

  readonly expandedIds = signal(new Set<string>());
  readonly searchQuery = signal('');

  constructor() {
    this.expandedIds.set(this.collectAllIds(this.service.tree()));
  }

  private collectAllIds(nodes: TreeNode[]): Set<string> {
    const ids = new Set<string>();
    const walk = (list: TreeNode[]) => {
      for (const n of list) {
        ids.add(n.id);
        walk(n.children);
      }
    };
    walk(nodes);
    return ids;
  }

  readonly showModal = signal(false);
  readonly modalNodeType = signal<'title' | 'season' | 'episode'>('episode');
  readonly modalDefaultNumber = signal<number | undefined>(undefined);
  readonly modalDefaultName = signal('');
  private addParentId: string | null = null;

  readonly showConfirm = signal(false);
  readonly confirmTitle = signal('');
  readonly confirmMessage = signal('');
  private pendingDeleteId: string | null = null;

  readonly filteredTree = computed(() => {
    const q = this.searchQuery();
    const nodes = this.service.tree();
    if (!q.trim()) return nodes;
    return this.service.filterTree(nodes, q);
  });

  get selectedId(): string | null {
    return this.editorState.selectedNode()?.id ?? null;
  }

  get editMode(): boolean {
    return this.editorState.editMode();
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  onSelect(node: TreeNode): void {
    this.editorState.select(node);
  }

  onToggle(id: string): void {
    this.expandedIds.update(ids => {
      const next = new Set(ids);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  toggleAll(): void {
    const allIds = this.collectAllIds(this.service.tree());
    const current = this.expandedIds();
    if (current.size === allIds.size) {
      this.expandedIds.set(new Set<string>());
    } else {
      this.expandedIds.set(allIds);
    }
  }

  toggleEditMode(): void {
    this.editorState.toggleEditMode();
  }

  private buildDefaultName(parent: TreeNode, childType: 'season' | 'episode', number: number): string {
    if (childType === 'season') {
      return `${parent.name} S${number}`;
    }
    const seasonNum = parent.meta?.['seasonNumber'] ?? number;
    const title = this.service.findParentTitle(parent.id);
    return `${title?.name ?? ''} S${seasonNum} Episode ${number}`;
  }

  onAdd(parent: TreeNode): void {
    if (parent.type === 'episode') return;

    const childType = parent.type === 'title' ? 'season' : 'episode';
    const nextNumber = parent.children.length + 1;

    this.addParentId = parent.id;
    this.modalNodeType.set(childType);
    this.modalDefaultNumber.set(nextNumber);
    this.modalDefaultName.set(this.buildDefaultName(parent, childType, nextNumber));
    this.showModal.set(true);
  }

  onAddTitle(): void {
    this.addParentId = null;
    this.modalNodeType.set('title');
    this.modalDefaultNumber.set(undefined);
    this.modalDefaultName.set('');
    this.showModal.set(true);
  }

  onAddConfirmed(result: AddNodeResult): void {
    const parentId = this.addParentId;
    if (parentId) {
      this.service.addChildAndSelect(parentId, result.name, result.description, result.number, result.icon);
      this.expandedIds.update(ids => new Set(ids).add(parentId));
    } else {
      this.service.addRootTitle(result.name, result.description, result.icon);
    }
    this.showModal.set(false);
    this.addParentId = null;
  }

  onAddDismissed(): void {
    this.showModal.set(false);
    this.addParentId = null;
  }

  onDelete(id: string): void {
    const node = this.service.findNode(this.service.tree(), id);
    if (!node) return;
    this.pendingDeleteId = id;
    this.confirmTitle.set('Delete ' + node.type.charAt(0).toUpperCase() + node.type.slice(1));
    this.confirmMessage.set(`Are you sure you want to delete "${node.name}"?`);
    this.showConfirm.set(true);
  }

  onDeleteConfirmed(): void {
    const id = this.pendingDeleteId;
    if (!id) return;

    const updated = this.service.deleteNode(this.service.tree(), id);
    this.service.setTree(updated);

    if (this.editorState.selectedNode()?.id === id) {
      this.editorState.select(null);
    }
    this.showConfirm.set(false);
    this.pendingDeleteId = null;
  }

  onDeleteDismissed(): void {
    this.showConfirm.set(false);
    this.pendingDeleteId = null;
  }

  onRename(event: { id: string; name: string }): void {
    this.service.setTree(this.service.renameNode(this.service.tree(), event.id, event.name));
  }
}
