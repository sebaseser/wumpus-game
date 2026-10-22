import { Injectable } from '@angular/core';
import { Facing, GameConfig, WumpusGame } from './game-engine';
import { GameAction } from '../shared/components/game-controls';

@Injectable({ providedIn: 'root' })
export class GameSession {
  game: WumpusGame | null = null;
  log: string[] = [];
  currentMessages: string[] = [];

  start(config: GameConfig): void {
    const game = new WumpusGame(config);
    this.game = game;
    this.currentMessages = game.perceptions();
    this.log = [
      `Comienza la expedición en un tablero de ${config.size} × ${config.size}.`,
      ...this.currentMessages,
    ];
  }

  perform(action: GameAction): void {
    const game = this.game;
    if (!game) return;

    const actions: Record<GameAction, () => string[]> = {
      forward: () => game.moveForward(),
      left: () => game.turnLeft(),
      right: () => game.turnRight(),
      shoot: () => game.shoot(),
      exit: () => game.exit(),
    };
    this.applyAction(game, actions[action]);
  }

  moveInDirection(facing: Facing): void {
    const game = this.game;
    if (!game) return;

    this.applyAction(game, () => game.moveInDirection(facing));
  }

  private applyAction(game: WumpusGame, action: () => string[]): void {
    const messages = action();
    if (messages.length) this.log = [...this.log, ...messages];
    this.currentMessages = [...new Set([...messages, ...game.perceptions()])].filter(
      (message) => message !== 'Avanzas una casilla.',
    );
  }

  reset(): void {
    this.game = null;
    this.log = [];
    this.currentMessages = [];
  }
}
