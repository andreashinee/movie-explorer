import { Injectable, signal } from '@angular/core';
import { TITLES, SEASONS, EPISODES } from '@data/movies';
import { LONG_DESCRIPTION, SHORT_DESCRIPTION } from '@data/mock-descriptions';
import { TreeNode } from '@models/tree-node.model';
import { EditorStateService } from '@services/editor-state.service';

@Injectable({
  providedIn: 'root',
})
export class MovieTreeService {
  private _tree = signal<TreeNode[]>([]);
  private nextId = 0;
  private parentMap = new Map<string, string>();

  constructor(private editorState: EditorStateService) {
    this._tree.set(this.buildTree());
    this.nextId = this.computeMaxNumericId(this._tree());
  }

  private computeMaxNumericId(nodes: TreeNode[]): number {
    let max = 0;
    const walk = (list: TreeNode[]) => {
      for (const n of list) {
        const match = n.id.match(/(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > max) max = num;
        }
        walk(n.children);
      }
    };
    walk(nodes);
    return max;
  }

  readonly tree = this._tree.asReadonly();

  setTree(tree: TreeNode[]): void {
    this._tree.set(tree);
    this.rebuildParentIndex(tree);
  }

  private genId(prefix: string): string {
    return `${prefix}-${++this.nextId}`;
  }

  private indexNode(nodes: TreeNode[], parentId?: string): void {
    for (const n of nodes) {
      if (parentId) this.parentMap.set(n.id, parentId);
      this.indexNode(n.children, n.id);
    }
  }

  private rebuildParentIndex(tree: TreeNode[]): void {
    this.parentMap.clear();
    this.indexNode(tree);
  }

  private extractSeasonNumber(name: string): number | undefined {
    const match = name.match(/S(\d+)/);
    return match ? parseInt(match[1], 10) : undefined;
  }

  buildTree(): TreeNode[] {
    const tree = TITLES.map((title) => {
      const titleSeasons = SEASONS.filter(
        (season) => season.title_id === title.id
      );

      return {
        id: `title-${title.id}`,
        name: title.name,
        type: 'title' as const,
        icon: title.icon,
        meta: {
          titleId: title.id,
          seasonCount: titleSeasons.length,
          description: SHORT_DESCRIPTION,
        },
        children: titleSeasons.map((season) => {
          const seasonEpisodes = EPISODES.filter(
            (episode) => episode.season_id === season.id
          );
          const seasonNumber = this.extractSeasonNumber(season.name) ?? 0;

          return {
            id: `season-${season.id}`,
            name: season.name,
            type: 'season' as const,
            icon: season.icon,
            meta: {
              seasonId: season.id,
              titleId: season.title_id,
              episodeCount: seasonEpisodes.length,
              seasonNumber,
              description: SHORT_DESCRIPTION,
            },
            children: seasonEpisodes.map((episode, idx) => ({
              id: `episode-${episode.id}`,
              name: episode.name,
              type: 'episode' as const,
              icon: episode.icon,
              meta: {
                episodeId: episode.id,
                seasonId: episode.season_id,
                description: LONG_DESCRIPTION,
                episodeNumber: idx + 1,
                seasonNumber,
              },
              children: [],
            })),
          };
        }),
      };
    });
    this.rebuildParentIndex(tree);
    return tree;
  }

  filterTree(nodes: TreeNode[], searchTerm: string): TreeNode[] {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return nodes;
    return nodes
      .map((node) => this.filterNode(node, normalizedSearch))
      .filter((node): node is TreeNode => Boolean(node));
  }

  addChild(tree: TreeNode[], parentId: string, name: string, description?: string, number?: number, icon?: string): TreeNode[] {
    return this.addChildToTree(tree, parentId, name, description, number, icon);
  }

  addChildAndSelect(parentId: string, name: string, description?: string, number?: number, icon?: string): TreeNode | null {
    const updated = this.addChild(this._tree(), parentId, name, description, number, icon);
    this._tree.set(updated);
    const updatedParent = this.findNode(updated, parentId);
    if (updatedParent) this.editorState.select(updatedParent);
    return updatedParent;
  }

  private addChildToTree(
    nodes: TreeNode[],
    parentId: string,
    name: string,
    description?: string,
    number?: number,
    icon?: string,
  ): TreeNode[] {
    return nodes.map((n) => {
      if (n.id !== parentId) {
        if (n.children.length > 0) {
          return { ...n, children: this.addChildToTree(n.children, parentId, name, description, number, icon) };
        }
        return n;
      }

      const isTitle = n.type === 'title';
      const isSeason = n.type === 'season';

      const seasonNumber = isTitle
        ? (number ?? this.extractSeasonNumber(name))
        : (isSeason ? (n.meta?.['seasonNumber'] as number | undefined) : undefined);

      const episodeNumber = isSeason
        ? (number ?? n.children.length + 1)
        : undefined;

      const meta: Record<string, unknown> = {
        createdAt: new Date().toISOString(),
        ...(description ? { description } : {}),
      };


      if (seasonNumber != null) meta['seasonNumber'] = seasonNumber;
      if (episodeNumber != null) meta['episodeNumber'] = episodeNumber;

      const defaultIcon = isTitle ? 'auto_stories' : 'assignment_returned';

      const newNode: TreeNode = {
        id: this.genId(isTitle ? 'season' : 'episode'),
        name,
        type: isTitle ? 'season' : 'episode',
        icon: icon || defaultIcon,
        meta,
        children: [],
      };

      const newChildren = [...n.children, newNode];

      return {
        ...n,
        children: newChildren,
        meta: {
          ...n.meta,
          seasonCount: isTitle ? newChildren.length : (n.meta?.['seasonCount'] as number | undefined),
          episodeCount: isSeason ? newChildren.length : (n.meta?.['episodeCount'] as number | undefined),
        },
      };
    });
  }

  addRootTitle(name: string, description?: string, icon?: string): void {
    const newTitle: TreeNode = {
      id: this.genId('title'),
      name,
      type: 'title',
      icon: icon || 'movie',
      meta: {
        createdAt: new Date().toISOString(),
        seasonCount: 0,
        ...(description ? { description } : {}),
      },
      children: [],
    };

    this._tree.update(tree => [...tree, newTitle]);
  }

  renameNode(nodes: TreeNode[], id: string, name: string): TreeNode[] {
    return nodes.map((n) => {
      if (n.id === id) return { ...n, name };
      if (n.children.length > 0) return { ...n, children: this.renameNode(n.children, id, name) };
      return n;
    });
  }

  deleteNode(nodes: TreeNode[], id: string): TreeNode[] {
    return nodes
      .filter((node) => node.id !== id)
      .map((node) => {
        const updatedChildren = this.deleteNode(node.children, id);
        const childrenChanged = updatedChildren.length !== node.children.length;
        if (!childrenChanged) {
          return { ...node, children: updatedChildren };
        }
        const meta = { ...node.meta };
        if (node.type === 'title') (meta as Record<string, unknown>)['seasonCount'] = updatedChildren.length;
        if (node.type === 'season') (meta as Record<string, unknown>)['episodeCount'] = updatedChildren.length;
        return { ...node, children: updatedChildren, meta };
      });
  }

  findNode(nodes: TreeNode[], id: string): TreeNode | null {
    for (const n of nodes) {
      if (n.id === id) return n;
      const found = this.findNode(n.children, id);
      if (found) return found;
    }
    return null;
  }

  findParentTitle(childId: string): TreeNode | null {
    let current = childId;
    while (current) {
      const parentId = this.parentMap.get(current);
      if (!parentId) return null;
      const parent = this.findNode(this._tree(), parentId);
      if (parent?.type === 'title') return parent;
      current = parentId;
    }
    return null;
  }

  getEpisodeList(node: TreeNode): TreeNode[] {
    if (node.type === 'season') return node.children;
    return [];
  }

  countAll(nodes?: TreeNode[]): number {
    const list = nodes ?? this._tree();
    return list.reduce((s, n) => s + 1 + this.countAll(n.children), 0);
  }

  private filterNode(node: TreeNode, searchTerm: string): TreeNode | null {
    const nodeMatches = node.name.toLowerCase().includes(searchTerm);
    const matchingChildren = node.children
      .map((child) => this.filterNode(child, searchTerm))
      .filter((child): child is TreeNode => Boolean(child));

    if (nodeMatches || matchingChildren.length > 0) {
      return { ...node, meta: { ...node.meta }, children: matchingChildren };
    }
    return null;
  }
}
