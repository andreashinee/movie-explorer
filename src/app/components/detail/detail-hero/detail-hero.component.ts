import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Button } from 'primeng/button';
import { TreeNode } from '@models/tree-node.model';
import { getImageUrl, handleImgError } from '@data/seed-data';

@Component({
  selector: 'app-detail-hero',
  standalone: true,
  imports: [Button],
  templateUrl: './detail-hero.component.html',
  styleUrl: './detail-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailHeroComponent {
  readonly node = input.required<TreeNode>();
  readonly parentTitle = input<TreeNode | null>(null);

  heroImg(): string {
    return getImageUrl(this.node().id, 1200, 500);
  }

  meta(key: string): unknown {
    return this.node().meta?.[key] ?? null;
  }

  readonly onImgError = handleImgError;
}
