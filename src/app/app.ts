import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TreePanelComponent } from './components/tree/tree-panel/tree-panel.component';
import { DetailPanelComponent } from './components/detail/detail-panel/detail-panel.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TreePanelComponent, DetailPanelComponent, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
