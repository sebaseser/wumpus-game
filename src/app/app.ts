import { Component } from '@angular/core';
import { GameConfig, WumpusGame } from './game-engine';
import { GameAction, GameControls } from './game-controls';
import { GameGrid } from './game-grid';
import { GameStatus } from './game-status';
import { PerceptionLog } from './perception-log';
import { SetupForm } from './setup-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SetupForm, GameGrid, GameControls, GameStatus, PerceptionLog],
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  game: WumpusGame | null = null;
  log: string[] = [];

  startGame(config: GameConfig): void {
    this.game = new WumpusGame(config);
    this.log = [
      `Comienza la expedición en un tablero de ${config.size} × ${config.size}.`,
      ...this.game.perceptions(),
    ];
  }

  perform(action: GameAction): void {
    if (!this.game) return;
    const messages = {
      forward: () => this.game!.moveForward(),
      left: () => this.game!.turnLeft(),
      right: () => this.game!.turnRight(),
      shoot: () => this.game!.shoot(),
      exit: () => this.game!.exit(),
    }[action]();
    if (messages.length) this.log = [...this.log, ...messages];
  }

  newGame(): void {
    this.game = null;
    this.log = [];
  }
}
