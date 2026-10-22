import { TestBed } from '@angular/core/testing';
import { WumpusGame } from '../../core/game-engine';
import { GameStatus } from './game-status';

describe('GameStatus', () => {
  it('shows direction, gold, arrows and actions, and refreshes after an action', () => {
    const game = new WumpusGame({ size: 4, pitCount: 1, arrows: 3 });
    const fixture = TestBed.createComponent(GameStatus);
    fixture.componentRef.setInput('game', game);
    fixture.detectChanges();

    const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text()).toContain('Sur');
    expect(text()).toContain('Pendiente');
    expect(text()).toContain('3');

    game.turnLeft();
    fixture.detectChanges();

    expect(text()).toContain('Este');
    expect(text()).toContain('Acciones1');
  });
});
