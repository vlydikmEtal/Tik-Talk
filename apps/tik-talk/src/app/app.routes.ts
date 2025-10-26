import { Routes } from '@angular/router';
import { canActivateAuth, LoginPageComponent } from '@tt/auth';
import { ProfilePageComponent, SearchPageComponent, SettingsPagesComponent } from '@tt/profile';
import { chatsRoutes } from '@tt/chats';
import { LayoutComponent } from '@tt/layout';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { PostsEffects, postsFeature, ProfileEffects, profileFeature } from '@tt/data-access';
import { ExperimentalComponent, FormExperimentComponent } from '@tt/experimental';


export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'profile/me',
        pathMatch: 'full'
      },
      {
        path: 'profile/:id',
        component: ProfilePageComponent,
        providers: [
          provideState(postsFeature),
          provideEffects(PostsEffects)
        ]
      },
      {
        path: 'settings',
        component: SettingsPagesComponent
      },
      {
        path: 'search',
        component: SearchPageComponent,
        providers: [
          provideState(profileFeature),
          provideEffects(ProfileEffects)
        ]
      },
      {
        path: 'chats',
        loadChildren: () => chatsRoutes
      }
    ],
    canActivate: [canActivateAuth]
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'forms',
    component: FormExperimentComponent
  }
];
