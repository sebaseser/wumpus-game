import { GameConfig, WumpusGame, validateConfig } from './game-engine';

const baseConfig: GameConfig = { size: 3, pitCount: 0, arrows: 2 };
const sequence = (...values: number[]): (() => number) => {
  let index = 0;
  return () => values[Math.min(index++, values.length - 1)] ?? 0;
};

describe('validateConfig', () => {
  it('accepts the documented integer ranges without an arbitrary maximum', () => {
    expect(validateConfig({ size: 2, pitCount: 1, arrows: 0 })).toEqual([]);
    expect(validateConfig({ size: 50, pitCount: 20, arrows: 1000 })).toEqual([]);
  });

  it('rejects non-integers, undersized boards, negative values, and too many pits', () => {
    expect(validateConfig({ size: 1, pitCount: 0, arrows: 1 }).length).toBeGreaterThan(0);
    expect(validateConfig({ size: 2.5, pitCount: 0, arrows: 1 }).length).toBeGreaterThan(0);
    expect(validateConfig({ size: 3, pitCount: -1, arrows: 1 }).length).toBeGreaterThan(0);
    expect(validateConfig({ size: 3, pitCount: 7, arrows: 1 }).length).toBeGreaterThan(0);
    expect(validateConfig({ size: 3, pitCount: 0, arrows: -1 }).length).toBeGreaterThan(0);
    expect(validateConfig({ size: 3, pitCount: 0, arrows: 1.2 }).length).toBeGreaterThan(0);
  });
});

describe('WumpusGame layout generation', () => {
  it('places every item distinctly and never places a hazard or gold at the start', () => {
    const game = new WumpusGame({ size: 4, pitCount: 5, arrows: 3 }, () => 0.37);
    const locations = [game.gold, game.wumpus, ...game.pits];
    expect(new Set(locations.map(({ row, col }) => `${row},${col}`)).size).toBe(locations.length);
    expect(locations.some(({ row, col }) => row === 0 && col === 0)).toBeFalse();
    expect(game.pits.length).toBe(5);
  });

  it('always generates a safe route to the gold, including the maximum pit count', () => {
    const maximumPits = 3 * 3 - 3;
    for (let seed = 0; seed < 30; seed++) {
      const game = new WumpusGame({ size: 3, pitCount: maximumPits, arrows: 0 }, () => seed / 30);
      expect(Math.abs(game.gold.row) + Math.abs(game.gold.col)).toBe(1);
      expect(game.safeRoute[game.safeRoute.length - 1]).toEqual(game.gold);
      expect(
        game.safeRoute.every(
          (step) =>
            !game.pits.some((pit) => pit.row === step.row && pit.col === step.col) &&
            !(game.wumpus.row === step.row && game.wumpus.col === step.col),
        ),
      ).toBeTrue();
      expect(
        game.pits.some(({ row, col }) => row === game.gold.row && col === game.gold.col),
      ).toBeFalse();
      expect(game.wumpus.row === game.gold.row && game.wumpus.col === game.gold.col).toBeFalse();
      if (game.gold.row === 1) game.moveForward();
      else {
        game.turnLeft();
        game.moveForward();
      }
      expect(game.position).toEqual(game.gold);
      expect(game.outcome).toBe('playing');
      expect(game.hasGold).toBeTrue();
    }
  });

  it('uses the injected random source for deterministic placement', () => {
    const first = new WumpusGame(baseConfig, () => 0);
    const second = new WumpusGame(baseConfig, () => 0);
    expect(first.gold).toEqual(second.gold);
    expect(first.wumpus).toEqual(second.wumpus);
    expect(first.pits).toEqual(second.pits);
  });
});

describe('WumpusGame actions and perceptions', () => {
  it('starts facing down and turns in 90-degree increments while counting actions', () => {
    const game = new WumpusGame(baseConfig, () => 0);
    expect(game.facing).toBe('S');
    game.turnLeft();
    expect(game.facing).toBe('E');
    game.turnRight();
    expect(game.facing).toBe('S');
    expect(game.actions).toBe(2);
  });

  it('keeps the hunter still at a wall and reports the bump', () => {
    const game = new WumpusGame(baseConfig, () => 0);
    game.turnRight();
    const messages = game.moveForward();
    expect(game.position).toEqual({ row: 0, col: 0 });
    expect(messages.join(' ')).toContain('pared');
    expect(game.actions).toBe(2);
  });

  it('moves one cell in the selected direction and updates facing in one action', () => {
    const game = new WumpusGame(baseConfig, () => 0);
    const messages = game.moveInDirection('E');

    expect(game.position).toEqual({ row: 0, col: 1 });
    expect(game.facing).toBe('E');
    expect(game.actions).toBe(1);
    expect(messages.length).toBeGreaterThan(0);
  });

  it('reports stench and breeze beside the live Wumpus and pits', () => {
    const stench = new WumpusGame(baseConfig, sequence(0.25, 0));
    expect(stench.perceptions()).toContain('Percibes un hedor.');
    const breeze = new WumpusGame({ size: 3, pitCount: 1, arrows: 1 }, sequence(0, 0.3, 0.2));
    expect(breeze.perceptions()).toContain('Sientes una brisa.');
  });

  it('collects the gold automatically and reports glitter while standing on it', () => {
    const game = new WumpusGame(baseConfig, sequence(0.25, 0));
    const messages = game.moveForward();
    expect(messages).toContain('¡Encontraste el oro y lo recogiste!');
    expect(messages).toContain('El oro brilla en esta sala.');
    expect(game.hasGold).toBeTrue();
    expect(game.position).toEqual(game.gold);
    expect(game.perceptions()).not.toContain('El oro brilla en esta sala.');
  });

  it('spends one arrow per shot, hits the Wumpus, and reports a scream', () => {
    const game = new WumpusGame({ size: 3, pitCount: 0, arrows: 2 }, sequence(0.25, 0));
    game.turnLeft(); // Face east, where the deterministic layout puts the Wumpus.
    const messages = game.shoot();
    expect(game.arrows).toBe(1);
    expect(game.wumpusAlive).toBeFalse();
    expect(messages.join(' ')).toContain('impacto');
    expect(messages).toContain('¡Oyes un grito!');
    expect(game.perceptions()).not.toContain('Percibes un hedor.');
    expect(game.actions).toBe(2);
  });

  it('reports a miss and refuses to shoot or spend an action without arrows', () => {
    const miss = new WumpusGame(baseConfig, sequence(0.25, 0));
    expect(miss.shoot().join(' ')).toContain('no alcanzas');
    expect(miss.arrows).toBe(1);

    const empty = new WumpusGame({ ...baseConfig, arrows: 0 }, sequence(0.25, 0));
    expect(empty.shoot()).toEqual([]);
    expect(empty.actions).toBe(0);
  });

  it('loses on a pit or live Wumpus and ignores the Wumpus after it is killed', () => {
    const pitGame = new WumpusGame({ size: 3, pitCount: 1, arrows: 1 }, sequence(0, 0.3, 0.2));
    expect(pitGame.moveForward().join(' ')).toContain('pozo');
    expect(pitGame.outcome).toBe('lost');

    const liveWumpusGame = new WumpusGame(baseConfig, sequence(0.25, 0));
    liveWumpusGame.turnLeft();
    expect(liveWumpusGame.moveForward().join(' ')).toContain('Wumpus te atrapó');
    expect(liveWumpusGame.outcome).toBe('lost');

    const wumpusGame = new WumpusGame(baseConfig, sequence(0.25, 0));
    wumpusGame.turnLeft();
    wumpusGame.shoot();
    wumpusGame.moveForward();
    expect(wumpusGame.outcome).toBe('playing');
  });

  it('blocks exit without gold, only permits escape at the start, and wins with gold', () => {
    const game = new WumpusGame(baseConfig, sequence(0.25, 0));
    expect(game.exit().join(' ')).toContain('bloqueada');
    game.moveForward();
    expect(game.exit().join(' ')).toContain('casilla inicial');
    game.turnLeft();
    game.turnLeft();
    game.moveForward();
    expect(game.position).toEqual(game.start);
    expect(game.exit().join(' ')).toContain('¡Ganaste!');
    expect(game.outcome).toBe('won');
  });

  it('tracks visited cells but hides undiscovered hazards until the game ends', () => {
    const game = new WumpusGame({ size: 3, pitCount: 1, arrows: 1 }, sequence(0.25, 0, 0));
    expect(game.cellContent(game.pits[0]!)).toBe('hidden');
    expect(game.cellContent(game.pits[0]!, true)).toBe('pit');
    expect(game.cellContent(game.wumpus)).toBe('hidden');
    game.moveForward();
    expect(game.cellContent(game.position)).toBe('hunter');
    expect(game.cellContent(game.pits[0]!)).toBe('hidden');
  });
});
