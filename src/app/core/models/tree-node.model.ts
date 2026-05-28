export interface TreeNode {
  id: string;
  name: string;
  type: 'title' | 'season' | 'episode';
  icon: string;
  children: TreeNode[];
  meta?: Record<string, unknown>;
}
