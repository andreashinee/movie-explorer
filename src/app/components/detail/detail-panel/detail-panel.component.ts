import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { Tag } from 'primeng/tag';
import { MovieTreeService } from '@services/movie-tree.service';
import { EditorStateService } from '@services/editor-state.service';
import { TreeNode } from '@models/tree-node.model';
import { getThumbnailUrl, handleImgError } from '@data/seed-data';
import { DetailHeroComponent } from '@components/detail/detail-hero/detail-hero.component';
import { AddNodeModalComponent, AddNodeResult } from '@components/shared/add-node-modal/add-node-modal.component';
import { ConfirmModalComponent } from '@components/shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-detail-panel',
  standalone: true,
  imports: [Tag, DetailHeroComponent, AddNodeModalComponent, ConfirmModalComponent],
  templateUrl: './detail-panel.component.html',
  styleUrl: './detail-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailPanelComponent {
  private service = inject(MovieTreeService);
  private editorState = inject(EditorStateService);

  readonly showModal = signal(false);
  readonly modalNodeType = signal<'title' | 'season' | 'episode'>('episode');
  readonly modalDefaultNumber = signal<number | undefined>(undefined);
  readonly modalDefaultName = signal('');

  readonly showConfirm = signal(false);
  readonly confirmMessage = signal('');
  readonly confirmTitle = signal('Confirm Delete');
  private pendingDeleteTarget: { node: TreeNode; parent?: TreeNode } | null = null;

  readonly vm = computed(() => {
    const node = this.editorState.selectedNode();
    const parentTitle = node && node.type !== 'title'
      ? this.service.findParentTitle(node.id)
      : null;
    const episodeList = node ? this.service.getEpisodeList(node) : [];
    const seasonList = node?.type === 'title' ? node.children : [];
    return { node, parentTitle, episodeList, seasonList };
  });

  getThumbnail(node: TreeNode): string {
    return getThumbnailUrl(node.id);
  }

  readonly onImgError = handleImgError;

  selectNode(node: TreeNode): void {
    this.editorState.select(node);
  }

  onAdd(): void {
    const node = this.editorState.selectedNode();
    if (!node || node.type === 'episode') return;

    const childType = node.type === 'title' ? 'season' : 'episode';
    const nextNumber = node.children.length + 1;

    this.modalNodeType.set(childType);
    this.modalDefaultNumber.set(nextNumber);

    let defaultName = '';
    if (childType === 'season') {
      defaultName = `${node.name} S${nextNumber}`;
    } else {
      const seasonNum = node.meta?.['seasonNumber'] ?? nextNumber;
      const title = this.service.findParentTitle(node.id);
      defaultName = `${title?.name ?? ''} S${seasonNum} Episode ${nextNumber}`;
    }
    this.modalDefaultName.set(defaultName);

    this.showModal.set(true);
  }

  onAddConfirmed(result: AddNodeResult): void {
    const node = this.editorState.selectedNode();
    if (!node) return;

    this.service.addChildAndSelect(node.id, result.name, result.description, result.number, result.icon);
    this.showModal.set(false);
  }

  onAddDismissed(): void {
    this.showModal.set(false);
  }

  onDelete(): void {
    const node = this.editorState.selectedNode();
    if (!node) return;
    this.pendingDeleteTarget = { node };
    this.confirmTitle.set('Delete ' + node.type.charAt(0).toUpperCase() + node.type.slice(1));
    this.confirmMessage.set(`Are you sure you want to delete "${node.name}"?`);
    this.showConfirm.set(true);
  }

  onDeleteChild(child: TreeNode): void {
    const parent = this.editorState.selectedNode();
    if (!parent) return;
    this.pendingDeleteTarget = { node: child, parent };
    this.confirmTitle.set('Delete ' + child.type.charAt(0).toUpperCase() + child.type.slice(1));
    this.confirmMessage.set(`Are you sure you want to delete "${child.name}"?`);
    this.showConfirm.set(true);
  }

  onDeleteConfirmed(): void {
    const target = this.pendingDeleteTarget;
    if (!target) return;

    const updated = this.service.deleteNode(this.service.tree(), target.node.id);
    this.service.setTree(updated);

    if (target.parent) {
      const updatedParent = this.service.findNode(updated, target.parent.id);
      if (updatedParent) this.editorState.select(updatedParent);
    } else {
      this.editorState.select(null);
    }

    this.showConfirm.set(false);
    this.pendingDeleteTarget = null;
  }

  onDeleteDismissed(): void {
    this.showConfirm.set(false);
    this.pendingDeleteTarget = null;
  }

  formatEpisodeNumber(node: TreeNode): string {
    const n = node.meta?.['episodeNumber'];
    return n != null ? String(n).padStart(2, '0') : '\u2014';
  }

  seasonNumber(node: TreeNode): number | null {
    return (node.meta?.['seasonNumber'] as number) ?? null;
  }

  episodeCount(node: TreeNode): number | null {
    return (node.meta?.['episodeCount'] as number) ?? null;
  }

  description(node: TreeNode): string | null {
    return (node.meta?.['description'] as string) ?? null;
  }
}
