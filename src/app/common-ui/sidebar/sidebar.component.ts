import { ProfileService } from './../../data/services/profile.service';
import { Component, inject } from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { CommonModule } from '@angular/common';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SvgIconComponent,
    CommonModule,
    SubscriberCardComponent,
    RouterModule,
    ImgUrlPipe
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  ProfileService = inject(ProfileService)
  subscribers$ = this.ProfileService.getSubscribersShortList()

  me = this.ProfileService.me

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: '',
    },
    {
      label: 'Чаты',
      icon: 'chat',
      link: 'chats',
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search',
    },
  ];

  ngOnInit() {
    firstValueFrom(this.ProfileService.getMe())
  }
}
