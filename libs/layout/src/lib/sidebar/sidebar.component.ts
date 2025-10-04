import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import { ProfileService } from '@tt/profile';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SvgIconComponent,
    CommonModule,
    SubscriberCardComponent,
    RouterModule,
    ImgUrlPipe,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  ProfileService = inject(ProfileService);
  subscribers$ = this.ProfileService.getSubscribersShortList();

  me = this.ProfileService.me;

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me',
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
    firstValueFrom(this.ProfileService.getMe());
  }
}
