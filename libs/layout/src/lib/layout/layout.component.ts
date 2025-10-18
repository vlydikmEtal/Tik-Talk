import { RouterOutlet } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
  cdr = inject(ChangeDetectorRef)

  constructor() {
    this.cdr.markForCheck()
  }
}
