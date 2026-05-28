import { Injectable, signal } from '@angular/core';
import { TreeNode } from '@models/tree-node.model';

@Injectable({
  providedIn: 'root',
})
export class EditorStateService {
  readonly selectedNode = signal<TreeNode | null>(null);
  readonly editMode = signal(false);

  toggleEditMode(): void {
    this.editMode.update(v => !v);
  }

  select(node: TreeNode | null): void {
    this.selectedNode.set(node);
  }
}
