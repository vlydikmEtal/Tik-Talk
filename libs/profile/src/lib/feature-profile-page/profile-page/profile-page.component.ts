import { CommonModule } from '@angular/common';
import { switchMap} from 'rxjs';
import { Component, inject, signal } from '@angular/core';
import { ProfileHeaderComponent } from '../../ui/profile-header/profile-header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import { PostFeedComponent } from '@tt/posts';
import { ChatService, ProfileService } from '@tt/data-access';


@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    CommonModule,
    SvgIconComponent,
    RouterLink,
    ImgUrlPipe,
    PostFeedComponent,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  profileService = inject(ProfileService);
  chatsService = inject(ChatService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  me$ = toObservable(this.profileService.me);
  subscribers$ = this.profileService.getSubscribersShortList(5);

  isMyPage = signal(false);

  profile$ = this.route.params.pipe(

    switchMap(({ id }) => {
      this.isMyPage.set(id === 'me' || id === this.profileService.me()?.id);
      if (id === 'me') {
        return this.me$;
      }

      return this.profileService.getAccount(id);
    })
  );

  async sendMessage(userId: number) {
    this.router.navigate(['/chats', 'new'], {queryParams: {userId}});

  }
}
