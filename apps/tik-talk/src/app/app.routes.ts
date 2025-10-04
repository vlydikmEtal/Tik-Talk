import { Routes } from '@angular/router';
import { canActivateAuth, LoginPageComponent } from '@tt/auth';
import { ProfilePageComponent, SearchPageComponent, SettingsPagesComponent } from '@tt/profile';
import { chatsRoutes } from '@tt/chats';
import { LayoutComponent } from '@tt/layout';


export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'profile/me',
        pathMatch: 'full',
      },
      {
        path: 'profile/:id',
        component: ProfilePageComponent,
      },
      {
        path: 'settings',
        component: SettingsPagesComponent,
      },
      {
        path: 'search',
        component: SearchPageComponent,
      },
      {
        path: 'chats',
        loadChildren: () => chatsRoutes,
      },
    ],
    canActivate: [canActivateAuth],
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
];
