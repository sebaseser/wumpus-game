import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GameConfig } from '../../core/game-engine';
import { GameSession } from '../../core/game-session';
import { SetupForm } from './setup-form';

@Component({
  selector: 'app-setup-view',
  standalone: true,
  imports: [SetupForm],
  templateUrl: './setup-view.html',
})
export class SetupView {
  private readonly gameSession = inject(GameSession);
  private readonly router = inject(Router);

  startGame(config: GameConfig): void {
    this.gameSession.start(config);
    void this.router.navigate(['/play']);
  }
}
