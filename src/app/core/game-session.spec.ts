import { TestBed } from '@angular/core/testing';
import { GameSession } from './game-session';

describe('GameSession', () => {
  const config = { size: 4, pitCount: 1, arrows: 2 };
  let session: GameSession;

  beforeEach(() => {
    session = TestBed.inject(GameSession);
  });

  it('starts a game with an initial log and current messages', () => {
    session.start(config);

    expect(session.game).not.toBeNull();
    expect(session.log[0]).toContain('4 × 4');
    expect(session.currentMessages).toEqual(session.game!.perceptions());
  });

  it('records actions in the log and ignores them without a game', () => {
    session.perform('left');
    expect(session.log).toEqual([]);
    session.moveInDirection('N');
    expect(session.log).toEqual([]);

    session.start(config);
    const before = session.log.length;
    session.perform('shoot');

    expect(session.log.length).toBeGreaterThan(before);
    expect(session.game!.arrows).toBe(1);
  });

  it('shows the wall bump together with perceptions, never the advance message', () => {
    session.start(config);
    session.moveInDirection('N');

    expect(session.currentMessages.some((message) => message.includes('pared'))).toBeTrue();
    expect(session.currentMessages.length).toBeGreaterThan(1);

    session.reset();
    session.start(config);
    session.perform('forward');
    if (session.game!.outcome === 'playing') {
      expect(session.currentMessages).not.toContain('Avanzas una casilla.');
      expect(session.log).toContain('Avanzas una casilla.');
    }
  });

  it('clears everything on reset', () => {
    session.start(config);
    session.reset();

    expect(session.game).toBeNull();
    expect(session.log).toEqual([]);
    expect(session.currentMessages).toEqual([]);
  });
});
