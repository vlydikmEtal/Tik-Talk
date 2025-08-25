import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { LayoutComponent } from './common-ui/layout/layout.component';
import { canActivateAuth } from './auth/acces.guard';
import { SettingsPagesComponent } from './pages/settings-pages/settings-pages.component';
import { ChatsPageComponent } from './pages/chats-page/chats.component';
import { chatsRoutes } from './pages/chats-page/chatsRoutes';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '', redirectTo: 'profile/me', pathMatch: 'full'
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
        loadChildren: () => chatsRoutes
      },
    ],
    canActivate: [canActivateAuth],
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
];
