import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { GameSession } from './core/game-session';

export const routes: Routes = [
  {
    path: 'setup',
    loadComponent: () => import('./features/setup/setup-view').then((module) => module.SetupView),
  },
  {
    path: 'play',
    canActivate: [
      () => {
        const gameSession = inject(GameSession);
        return gameSession.game ? true : inject(Router).createUrlTree(['/setup']);
      },
    ],
    loadComponent: () => import('./features/play/play-view').then((module) => module.PlayView),
  },
  { path: '', pathMatch: 'full', redirectTo: 'setup' },
  { path: '**', redirectTo: 'setup' },
];
