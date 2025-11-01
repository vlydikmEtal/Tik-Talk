import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import { RouterModule } from '@angular/router';
import { firstValueFrom, Subscription, timer } from 'rxjs';
import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import { ChatService, isErrorMessage, ProfileService } from '@tt/data-access';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@tt/auth';



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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
  profileService = inject(ProfileService);
  chatService = inject(ChatService);
  authService = inject(AuthService);
  destroyRef = inject(DestroyRef);

  cdr = inject(ChangeDetectorRef);

  subscribers$ = this.profileService.getSubscribersShortList();

  unreadMessages = this.chatService.unreadMessagesCount;

  me = this.profileService.me;


  wsSubscribe!: Subscription;

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me'
    },
    {
      label: 'Чаты',
      icon: 'chat',
      link: 'chats'
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search'
    },
    {
      label: 'Доставка',
      icon: 'settings',
      link: 'experimental'
    }
  ];


  // reconnect() {
  //   this.wsSubscribe.unsubscribe();
  //
  //   this.chatService.connectWs()
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe()
  // }

  async reconnect() {

    console.log('реконект');
    await firstValueFrom(this.profileService.getMe());
    await firstValueFrom(timer(2000));

    this.connectWs();
  }

  connectWs() {
    this.wsSubscribe?.unsubscribe();

    this.wsSubscribe = this.chatService
      .connectWs()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((message) => {
          if (isErrorMessage(message)) {
            console.log('Неверный токен епт');
            this.reconnect();
          }
        });
  }

  ngOnInit() {
    firstValueFrom(this.profileService.getMe());

    this.connectWs();

    // this.wsSubscribe = this.chatService.connectWs()
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe((message) => {
    //     if (true) {
    //       this.reconnect()
    //     }
    //   })
  }

  constructor() {
    this.cdr.markForCheck()
  }
}
