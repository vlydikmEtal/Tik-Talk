import { ProfileService } from './../../data/services/profile.service';
import { RouterOutlet } from '@angular/router';
import { Component, inject } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  ProfileService = inject(ProfileService)

  ngOnInit() {
    console.log('ngOnInint')
    this.ProfileService.getMe().subscribe(val => console.log(val))
  }
}
