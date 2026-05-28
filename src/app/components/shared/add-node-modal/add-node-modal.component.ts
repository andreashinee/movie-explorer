import { ChangeDetectionStrategy, Component, input, output, signal, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface AddNodeResult {
  name: string;
  description: string;
  number?: number;
  icon: string;
}

@Component({
  selector: 'app-add-node-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-node-modal.component.html',
  styleUrl: './add-node-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNodeModalComponent implements OnInit, OnDestroy {
  private static readonly ICONS_BY_TYPE: Record<string, string[]> = {
    title: ['tv'],
    season: ['auto_stories', 'assured_workload'],
    episode: ['assignment_returned', 'assignment_return'],
  };
  private static readonly ICON_LABELS: Record<string, string> = {
    tv: 'TV',
    auto_stories: 'Book',
    assured_workload: 'Shield',
    assignment_returned: 'Clipboard Check',
    assignment_return: 'Clipboard Return',
  };
  readonly nodeType = input<'title' | 'season' | 'episode'>('episode');
  readonly defaultNumber = input<number | undefined>(undefined);
  readonly defaultName = input<string>('');

  nodeName = '';
  nodeDescription = '';
  selectedIcon = '';

  private _nodeNumber = signal<number | undefined>(undefined);

  get nodeNumber(): number | undefined {
    return this._nodeNumber();
  }

  set nodeNumber(v: number | undefined) {
    this._nodeNumber.set(v);
  }

  readonly confirmed = output<AddNodeResult>();
  readonly dismissed = output<void>();

  ngOnInit(): void {
    this.nodeName = this.defaultName();
    this._nodeNumber.set(this.defaultNumber());
    this.selectedIcon = this.icons[0] ?? '';
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  get icons(): string[] {
    return AddNodeModalComponent.ICONS_BY_TYPE[this.nodeType()] ?? [];
  }

  iconLabel(icon: string): string {
    return AddNodeModalComponent.ICON_LABELS[icon] ?? icon;
  }

  get showIconDropdown(): boolean {
    return this.icons.length > 0;
  }


  get title(): string {
    const map: Record<string, string> = {
      title: 'Add Title',
      season: 'Add Season',
      episode: 'Add Episode',
    };
    return map[this.nodeType()] ?? 'Add Node';
  }

  get showNumber(): boolean {
    return this.nodeType() !== 'title';
  }

  get hint(): string {
    const map: Record<string, string> = {
      title: 'Please add the name of the title and a description.',
      season: 'Please add the name of the season and a description.',
      episode: 'Please add the name of the episode and a description.',
    };
    return map[this.nodeType()] ?? 'Please add the name and a description.';
  }

  confirm(): void {
    if (!this.nodeName.trim()) return;
    this.confirmed.emit({
      name: this.nodeName.trim(),
      description: this.nodeDescription.trim(),
      number: this.nodeNumber,
      icon: this.selectedIcon || this.icons[0] || '',
    });
  }

  cancel(): void {
    this.dismissed.emit();
  }
}
