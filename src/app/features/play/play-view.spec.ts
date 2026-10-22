import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { GameSession } from '../../core/game-session';
import { PlayView } from './play-view';

describe('PlayView', () => {
  const create = () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const session = TestBed.inject(GameSession);
    session.start({ size: 4, pitCount: 1, arrows: 2 });
    const fixture = TestBed.createComponent(PlayView);
    fixture.detectChanges();
    return { fixture, session, root: fixture.nativeElement as HTMLElement };
  };
  const key = (init: KeyboardEventInit) =>
    new KeyboardEvent('keydown', { cancelable: true, ...init });

  it('shoots with the space bar even when a button has focus', () => {
    const { fixture, session } = create();
    const event = key({ key: ' ', code: 'Space' });
    fixture.componentInstance.handleKeyDown(event);

    expect(event.defaultPrevented).toBeTrue();
    expect(session.game!.arrows).toBe(1);
  });

  it('exits with Enter, ending the game only at the start with gold', () => {
    const { fixture, session } = create();
    const event = key({ key: 'Enter' });
    fixture.componentInstance.handleKeyDown(event);

    expect(event.defaultPrevented).toBeTrue();
    expect(session.log.length).toBeGreaterThan(1);
  });

  it('ignores repeated Space/Enter and keys typed in inputs or with modifiers', () => {
    const { fixture, session } = create();
    const view = fixture.componentInstance;
    view.handleKeyDown(key({ key: ' ', code: 'Space', repeat: true }));
    view.handleKeyDown(key({ key: ' ', code: 'Space', ctrlKey: true }));
    const input = document.createElement('input');
    document.body.appendChild(input);
    const typed = key({ key: ' ', code: 'Space' });
    input.addEventListener('keydown', (event) => view.handleKeyDown(event));
    input.dispatchEvent(typed);
    input.remove();

    expect(session.game!.arrows).toBe(2);
  });

  it('moves with the arrow keys and ignores other keys', () => {
    const { fixture, session } = create();
    fixture.componentInstance.handleKeyDown(key({ key: 'ArrowRight' }));
    expect(session.game!.facing).toBe('E');

    const other = key({ key: 'a' });
    fixture.componentInstance.handleKeyDown(other);
    expect(other.defaultPrevented).toBeFalse();
  });

  it('prevents the space key-up from activating a focused button', () => {
    const { fixture } = create();
    const event = new KeyboardEvent('keyup', { key: ' ', code: 'Space', cancelable: true });
    fixture.componentInstance.handleKeyUp(event);

    expect(event.defaultPrevented).toBeTrue();
  });

  it('shows the cause of defeat in the result dialog', () => {
    const { fixture, session, root } = create();
    session.game!.outcome = 'lost';
    session.game!.lossCause = 'pit';
    fixture.componentRef.injector.get(ChangeDetectorRef).markForCheck();
    fixture.detectChanges();

    expect(root.querySelector('dialog')?.textContent).toContain('Caíste en un pozo.');
  });

  it('hides revealed elements and returns to setup on a new game', () => {
    const { fixture, session } = create();
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    fixture.componentInstance.showHiddenElements = true;
    fixture.componentInstance.newGame();

    expect(fixture.componentInstance.showHiddenElements).toBeFalse();
    expect(session.game).toBeNull();
    expect(navigate).toHaveBeenCalledWith(['/setup']);
  });
});
