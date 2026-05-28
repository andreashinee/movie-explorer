import { ChangeDetectionStrategy, Component, input, output, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalComponent implements OnInit, OnDestroy {
  readonly title = input('Confirm Delete');
  readonly message = input('Are you sure?');

  readonly confirmed = output<void>();
  readonly dismissed = output<void>();

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  confirm(): void {
    this.confirmed.emit();
  }

  cancel(): void {
    this.dismissed.emit();
  }
}
