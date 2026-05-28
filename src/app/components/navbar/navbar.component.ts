import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MovieTreeService } from '@services/movie-tree.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private service = inject(MovieTreeService);
  readonly totalNodes = computed(() => this.service.countAll());
}
