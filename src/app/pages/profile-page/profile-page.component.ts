import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs';
import { ProfileService } from './../../data/services/profile.service';
import { Component, inject } from '@angular/core';
import { ProfileHeaderComponent } from '../../common-ui/profile-header/profile-header.component';
import { ActivatedRoute } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { SvgIconComponent } from '../../common-ui/svg-icon/svg-icon.component';
import { RouterLink } from '@angular/router';
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe';
import { PostFeedComponent } from "./post-feed/post-feed.component";

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [ProfileHeaderComponent, CommonModule, SvgIconComponent, RouterLink, ImgUrlPipe, PostFeedComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  ProfileService = inject(ProfileService);
  route = inject(ActivatedRoute);

  me$ = toObservable(this.ProfileService.me);
  subscribers$ = this.ProfileService.getSubscribersShortList(5);

  profile$ = this.route.params.pipe(
    switchMap(({ id }) => {
      if (id === 'me') {
        return this.me$;
      }

      return this.ProfileService.getAccount(id);
    })
  );
}
