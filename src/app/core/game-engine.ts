export interface Position {
  row: number;
  col: number;
}

export interface GameConfig {
  size: number;
  pitCount: number;
  arrows: number;
}

export type Facing = 'N' | 'E' | 'S' | 'W';
export type GameOutcome = 'playing' | 'won' | 'lost';
export type CellContent = 'hunter' | 'start' | 'gold' | 'wumpus' | 'pit' | 'visited' | 'hidden';

const DIRECTIONS: Record<Facing, Position> = {
  N: { row: -1, col: 0 },
  E: { row: 0, col: 1 },
  S: { row: 1, col: 0 },
  W: { row: 0, col: -1 },
};
const FACING_ORDER: Facing[] = ['N', 'E', 'S', 'W'];
const START: Position = { row: 0, col: 0 };
const positionKey = ({ row, col }: Position): string => `${row},${col}`;
const samePosition = (a: Position, b: Position): boolean => a.row === b.row && a.col === b.col;

export function validateConfig(config: GameConfig): string[] {
  const errors: string[] = [];
  if (!Number.isInteger(config.size) || config.size < 2) {
    errors.push('El tamaño del tablero debe ser un número entero de al menos 2.');
  }
  if (!Number.isInteger(config.pitCount) || config.pitCount < 0) {
    errors.push('La cantidad de pozos debe ser un número entero igual o mayor que 0.');
  }
  if (
    Number.isInteger(config.size) &&
    config.size >= 2 &&
    Number.isInteger(config.pitCount) &&
    config.pitCount > config.size * config.size - 3
  ) {
    errors.push(
      `Con este tablero puedes colocar como máximo ${config.size * config.size - 3} pozos.`,
    );
  }
  if (!Number.isInteger(config.arrows) || config.arrows < 0) {
    errors.push('La cantidad de flechas debe ser un número entero igual o mayor que 0.');
  }
  return errors;
}

/**
 * Rules and state for one game. The injected random source makes generated
 * layouts reproducible in tests.
 */
export class WumpusGame {
  readonly size: number;
  readonly start: Position = START;
  readonly gold: Position;
  readonly wumpus: Position;
  readonly pits: Position[];
  readonly safeRoute: Position[];
  readonly visited = new Set<string>([positionKey(START)]);
  facing: Facing = 'S';
  arrows: number;
  actions = 0;
  hasGold = false;
  wumpusAlive = true;
  outcome: GameOutcome = 'playing';
  lossCause: 'pit' | 'wumpus' | null = null;

  constructor(
    readonly config: GameConfig,
    random: () => number = Math.random,
  ) {
    const errors = validateConfig(config);
    if (errors.length) {
      throw new Error(errors.join(' '));
    }
    this.size = config.size;
    this.arrows = config.arrows;

    const destinations = this.allPositions().filter((position) => !samePosition(position, START));
    let gold = this.takeRandom(destinations, random);
    let route = this.randomizedRoute(gold, random);
    let available = this.allPositions().filter(
      (position) =>
        !samePosition(position, START) && !route.some((step) => samePosition(step, position)),
    );

    // Dense layouts may not leave enough cells for the hazards around a
    // longer route. In that case, move the gold to a random adjacent cell.
    if (available.length < config.pitCount + 1) {
      const adjacentGolds = [
        { row: 1, col: 0 },
        { row: 0, col: 1 },
      ];
      gold =
        adjacentGolds[
          Math.min(adjacentGolds.length - 1, Math.floor(random() * adjacentGolds.length))
        ]!;
      route = [gold];
      available = this.allPositions().filter(
        (position) => !samePosition(position, START) && !samePosition(position, gold),
      );
    }
    this.gold = gold;
    this.safeRoute = route;
    this.wumpus = this.takeRandom(available, random);
    const afterWumpus = available.filter((position) => !samePosition(position, this.wumpus));
    this.pits = this.takeRandomMany(afterWumpus, config.pitCount, random);
  }

  get position(): Position {
    return this.currentPosition;
  }

  private currentPosition: Position = { ...START };

  turnLeft(): string[] {
    if (!this.canAct()) return [];
    const index = FACING_ORDER.indexOf(this.facing);
    this.facing = FACING_ORDER[(index + 3) % 4]!;
    this.actions++;
    return this.withPerceptions('Giras a la izquierda.');
  }

  turnRight(): string[] {
    if (!this.canAct()) return [];
    const index = FACING_ORDER.indexOf(this.facing);
    this.facing = FACING_ORDER[(index + 1) % 4]!;
    this.actions++;
    return this.withPerceptions('Giras a la derecha.');
  }

  moveForward(): string[] {
    return this.moveInDirection(this.facing);
  }

  moveInDirection(facing: Facing): string[] {
    if (!this.canAct()) return [];
    this.facing = facing;
    this.actions++;
    const delta = DIRECTIONS[this.facing];
    const next = { row: this.position.row + delta.row, col: this.position.col + delta.col };
    if (!this.isInside(next))
      return this.withPerceptions('¡Tocaste una pared! No puedes salir del tablero.');

    this.currentPosition = next;
    this.visited.add(positionKey(next));
    if (this.pits.some((pit) => samePosition(pit, next))) {
      this.outcome = 'lost';
      this.lossCause = 'pit';
      return ['Caíste en un pozo. La partida terminó.'];
    }
    if (this.wumpusAlive && samePosition(this.wumpus, next)) {
      this.outcome = 'lost';
      this.lossCause = 'wumpus';
      return ['¡El Wumpus te atrapó! La partida terminó.'];
    }
    if (samePosition(this.gold, next) && !this.hasGold) {
      const perceptions = this.perceptions();
      this.hasGold = true;
      return ['¡Encontraste el oro y lo recogiste!', ...perceptions];
    }
    return this.withPerceptions('Avanzas una casilla.');
  }

  shoot(): string[] {
    if (!this.canAct() || this.arrows === 0) return [];
    this.actions++;
    this.arrows--;
    let cell = { ...this.position };
    const delta = DIRECTIONS[this.facing];
    while (true) {
      cell = { row: cell.row + delta.row, col: cell.col + delta.col };
      if (!this.isInside(cell)) break;
      if (this.wumpusAlive && samePosition(this.wumpus, cell)) {
        this.wumpusAlive = false;
        return ['Disparas una flecha: ¡impacto! El Wumpus ha muerto.', '¡Oyes un grito!'];
      }
    }
    return ['Disparas una flecha, pero no alcanzas al Wumpus.'];
  }

  exit(): string[] {
    if (!this.canAct()) return [];
    this.actions++;
    if (!samePosition(this.position, START)) {
      return ['La salida solo está disponible en la casilla inicial.'];
    }
    if (!this.hasGold) return ['La salida está bloqueada: todavía no tienes el oro.'];
    this.outcome = 'won';
    return ['Sales de la cueva con el oro. ¡Ganaste!'];
  }

  /** Optionally reveals hidden map elements without changing game state. */
  cellContent(position: Position, revealHiddenElements = false): CellContent {
    if (samePosition(position, this.position) && this.outcome !== 'lost') return 'hunter';
    if (this.outcome !== 'playing' || revealHiddenElements) {
      if (samePosition(position, this.gold)) return 'gold';
      if (this.wumpusAlive && samePosition(position, this.wumpus)) return 'wumpus';
      if (this.pits.some((pit) => samePosition(pit, position))) return 'pit';
    }
    if (this.visited.has(positionKey(position))) return 'visited';
    if (samePosition(position, START)) return 'start';
    return 'hidden';
  }

  perceptions(): string[] {
    const here = this.position;
    const messages: string[] = [];
    if (this.wumpusAlive && this.adjacent(here, this.wumpus)) messages.push('Percibes un hedor.');
    if (this.pits.some((pit) => this.adjacent(here, pit))) messages.push('Sientes una brisa.');
    if (!this.hasGold && samePosition(here, this.gold))
      messages.push('El oro brilla en esta sala.');
    if (!messages.length) messages.push('No percibes nada inusual.');
    return messages;
  }

  private withPerceptions(message: string): string[] {
    return [message, ...this.perceptions()];
  }

  private adjacent(a: Position, b: Position): boolean {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
  }

  private canAct(): boolean {
    return this.outcome === 'playing';
  }

  private isInside(position: Position): boolean {
    return (
      position.row >= 0 && position.col >= 0 && position.row < this.size && position.col < this.size
    );
  }

  private allPositions(): Position[] {
    return Array.from({ length: this.size * this.size }, (_, index) => ({
      row: Math.floor(index / this.size),
      col: index % this.size,
    }));
  }

  private takeRandom(positions: Position[], random: () => number): Position {
    const index = Math.min(positions.length - 1, Math.floor(random() * positions.length));
    return positions.splice(index, 1)[0]!;
  }

  private takeRandomMany(positions: Position[], count: number, random: () => number): Position[] {
    const selected: Position[] = [];
    for (let index = 0; index < count; index++) selected.push(this.takeRandom(positions, random));
    return selected;
  }

  private randomizedRoute(destination: Position, random: () => number): Position[] {
    const route: Position[] = [];
    let row = START.row;
    let col = START.col;
    while (row !== destination.row || col !== destination.col) {
      const canMoveDown = row < destination.row;
      const canMoveRight = col < destination.col;
      const moveRight = canMoveRight && (!canMoveDown || random() >= 0.5);
      if (moveRight) col++;
      else row++;
      route.push({ row, col });
    }
    return route;
  }
}
