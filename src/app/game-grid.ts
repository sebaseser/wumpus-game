import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CellContent, Facing, Position, WumpusGame } from './game-engine';

interface GridCell {
  position: Position;
  content: CellContent;
  isStart: boolean;
  isHunter: boolean;
}

const ICONS: Record<CellContent, string> = {
  hunter: '🧭',
  start: '⌂',
  gold: '💰',
  wumpus: '👹',
  pit: '🕳️',
  visited: '·',
  hidden: '',
};

const LABELS: Record<CellContent, string> = {
  hunter: 'cazador',
  start: 'salida',
  gold: 'oro',
  wumpus: 'Wumpus',
  pit: 'pozo',
  visited: 'casilla visitada',
  hidden: 'casilla desconocida',
};

@Component({
  selector: 'app-game-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <div class="grid-frame">
      <div class="grid" role="grid" aria-label="Mapa de la cueva"
        [style.grid-template-columns]="'repeat(' + size + ', minmax(0, 1fr))'">
        @for (cell of cells; track cell.position.row + ',' + cell.position.col) {
          <div class="cell" role="gridcell"
            [class.visited]="cell.content === 'visited' || cell.content === 'hunter'"
            [class.start]="cell.isStart"
            [class.hunter]="cell.isHunter"
            [class.revealed]="cell.content === 'gold' || cell.content === 'wumpus' || cell.content === 'pit'"
            [attr.aria-label]="'Fila ' + (cell.position.row + 1) + ', columna ' + (cell.position.col + 1) + ': ' + LABELS[cell.content] + (cell.isHunter ? ', mirando ' + facingLabel : '')"
            [title]="'Fila ' + (cell.position.row + 1) + ', columna ' + (cell.position.col + 1) + ': ' + LABELS[cell.content]">
            @if (cell.isHunter) { <span class="hunter-icon" aria-hidden="true">{{ directionIcon }}</span> }
            @else if (cell.content !== 'hidden') { <span aria-hidden="true">{{ ICONS[cell.content] }}</span> }
          </div>
        }
      </div>
    </div>
    <div class="legend" aria-label="Leyenda del mapa">
      <span><i class="legend-start">⌂</i> Inicio</span>
      <span><i class="legend-hunter">↑</i> Cazador</span>
      <span><i class="legend-visited">·</i> Visitada</span>
      @if (game.outcome !== 'playing') {
        <span><i>💰</i> Oro</span><span><i>👹</i> Wumpus</span><span><i>🕳️</i> Pozo</span>
      } @else { <span><i class="legend-hidden">?</i> Sin explorar</span> }
    </div>
  `,
  styles: [`
    :host { display: block; min-width: 0; }
    .grid-frame { width: min(100%, 37rem); margin-inline: auto; padding: clamp(.45rem, 2vw, .85rem); border: 1px solid #33463c; border-radius: 1rem; background: #0a1511; box-shadow: inset 0 0 2rem #0008; }
    .grid { display: grid; gap: clamp(2px, .65vw, 6px); aspect-ratio: 1; }
    .cell { display: grid; place-items: center; min-width: 0; border: 1px solid #293a31; border-radius: clamp(3px, .8vw, 8px); color: #71847a; background: #15221c; font-size: clamp(.8rem, 3vw, 1.55rem); }
    .cell.start { box-shadow: inset 0 0 0 2px #526b56; }
    .cell.visited { color: #c3d0c6; background: #26372d; }
    .cell.hunter { color: #172016; background: #c6ed91; box-shadow: 0 0 16px #c6ed9180; }
    .cell.revealed { background: #362b25; }
    .cell span { line-height: 1; }
    .hunter-icon { display: inline-block; font-size: clamp(1rem, 4vw, 2rem); }
    .legend { display: flex; flex-wrap: wrap; justify-content: center; gap: .55rem 1rem; margin-top: 1rem; color: #9cab9f; font-size: .76rem; }
    .legend span { display: inline-flex; align-items: center; gap: .3rem; }
    .legend i { font-style: normal; }
    .legend-start { color: #c6ed91; }.legend-hunter { color: #c6ed91; }.legend-visited { color: #e9f0e9; }.legend-hidden { color: #58675f; }
  `],
})
export class GameGrid {
  @Input({ required: true }) game!: WumpusGame;

  get size(): number { return this.game.size; }
  get cells(): GridCell[] {
    const cells: GridCell[] = [];
    for (let row = 0; row < this.game.size; row++) {
      for (let col = 0; col < this.game.size; col++) {
        const position = { row, col };
        cells.push({
          position,
          content: this.game.cellContent(position),
          isStart: row === 0 && col === 0,
          isHunter: row === this.game.position.row && col === this.game.position.col,
        });
      }
    }
    return cells;
  }

  get directionIcon(): string {
    return ({ N: '↑', E: '→', S: '↓', W: '←' } as Record<Facing, string>)[this.game.facing];
  }

  get facingLabel(): string {
    return ({ N: 'norte', E: 'este', S: 'sur', W: 'oeste' } as Record<Facing, string>)[this.game.facing];
  }

  protected readonly ICONS = ICONS;
  protected readonly LABELS = LABELS;
}
