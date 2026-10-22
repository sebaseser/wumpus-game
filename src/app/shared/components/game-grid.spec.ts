import { TestBed } from '@angular/core/testing';
import { WumpusGame } from '../../core/game-engine';
import { GameGrid } from './game-grid';

describe('GameGrid', () => {
  const create = (showHiddenElements = false) => {
    const game = new WumpusGame({ size: 4, pitCount: 2, arrows: 3 });
    const fixture = TestBed.createComponent(GameGrid);
    fixture.componentRef.setInput('game', game);
    fixture.componentRef.setInput('showHiddenElements', showHiddenElements);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    return { game, fixture, root, cells: () => root.querySelectorAll('.cell') };
  };

  it('renders size × size cells and marks the start and hunter cell', () => {
    const { cells } = create();

    expect(cells().length).toBe(16);
    expect(cells()[0].classList).toContain('start');
    expect(cells()[0].classList).toContain('hunter');
    expect(cells()[0].getAttribute('aria-label')).toContain('mirando sur');
  });

  it('hides hazards by default and reveals them with showHiddenElements', () => {
    const { fixture, root } = create();
    expect(root.querySelectorAll('.cell.revealed').length).toBe(0);

    fixture.componentRef.setInput('showHiddenElements', true);
    fixture.detectChanges();

    expect(root.querySelectorAll('.cell.revealed').length).toBe(4);
  });

  it('marks visited cells and shows the facing arrow on the hunter', () => {
    const { game, fixture, root } = create();
    game.turnLeft();
    game.moveForward();
    fixture.detectChanges();

    expect(root.querySelectorAll('.cell.visited').length).toBe(2);
    expect(root.querySelector('.hunter-icon')?.textContent).toBe('→');
  });

  it('reveals the whole layout in the legend when the game is over', () => {
    const { game, fixture, root } = create();
    game.outcome = 'lost';
    fixture.detectChanges();

    expect(root.querySelector('.legend')?.textContent).toContain('Wumpus');
  });
});
