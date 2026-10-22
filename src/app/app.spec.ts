import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { routes } from './app.routes';
import { GameSession } from './core/game-session';

describe('App routing', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    });
  });

  it('redirects the root route to setup', async () => {
    const harness = await RouterTestingHarness.create('/');

    expect(TestBed.inject(Router).url).toBe('/setup');
    expect(harness.routeNativeElement?.textContent).toContain('Configura la expedición');
  });

  it('starts a game and navigates from setup to play', async () => {
    const harness = await RouterTestingHarness.create('/setup');
    const startButton = harness.routeNativeElement?.querySelector(
      'app-setup-form button[type="submit"]',
    ) as HTMLButtonElement;
    startButton.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    const text = harness.routeNativeElement?.textContent ?? '';
    expect(TestBed.inject(Router).url).toBe('/play');
    expect(text).toContain('Mapa de la cueva');
    expect(text).toContain('Acciones');
    expect(text).toContain('Disparar');
    expect(text).toContain('Bitácora');
    expect(text).toContain('Cazador');
    const grid = harness.routeNativeElement?.querySelector<HTMLElement>('[role="grid"]');
    expect(grid?.style.gridTemplateColumns).toBe('repeat(5, minmax(0px, 1fr))');
    expect(grid?.style.gridTemplateRows).toBe('repeat(5, minmax(0px, 1fr))');
    expect(grid?.querySelectorAll('[role="gridcell"]').length).toBe(25);
  });

  it('redirects direct visits to play when there is no active game', async () => {
    const harness = await RouterTestingHarness.create('/play');

    expect(TestBed.inject(Router).url).toBe('/setup');
    expect(harness.routeNativeElement?.textContent).toContain('Configura la expedición');
  });

  it('updates the game state when a play control is used', async () => {
    const harness = await RouterTestingHarness.create('/setup');
    harness.routeNativeElement
      ?.querySelector<HTMLButtonElement>('app-setup-form button[type="submit"]')
      ?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    harness.routeNativeElement
      ?.querySelector<HTMLButtonElement>(
        'app-game-controls button[aria-label="Girar a la izquierda"]',
      )
      ?.click();
    harness.detectChanges();

    expect(harness.routeNativeElement?.textContent).toContain('Este');
    expect(harness.routeNativeElement?.querySelector('.stat:last-child strong')?.textContent).toBe(
      '1',
    );
    const currentPerceptions = harness.routeNativeElement?.querySelectorAll('.current-room li');
    expect(currentPerceptions?.length).toBeGreaterThan(0);
    expect(harness.routeNativeElement?.querySelector('.current-room')?.textContent).toContain(
      'Casilla actual',
    );
    expect(harness.routeNativeElement?.querySelector('.current-room')?.textContent).toContain(
      'Giras a la izquierda.',
    );
  });

  it('moves in the direction of a keyboard arrow key', async () => {
    const harness = await RouterTestingHarness.create('/setup');
    harness.routeNativeElement
      ?.querySelector<HTMLButtonElement>('app-setup-form button[type="submit"]')
      ?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    const gameGrid = harness.routeNativeElement?.querySelector('app-game-grid');
    const event = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      bubbles: true,
      cancelable: true,
    });
    gameGrid?.dispatchEvent(event);
    harness.detectChanges();

    expect(event.defaultPrevented).toBeTrue();
    expect(harness.routeNativeElement?.querySelector('.coordinates')?.textContent).toContain(
      '(1, 2)',
    );
    expect(harness.routeNativeElement?.querySelector('.stat:last-child strong')?.textContent).toBe(
      '1',
    );
    expect(harness.routeNativeElement?.textContent).toContain('Este');
    expect(
      Array.from(
        harness.routeNativeElement?.querySelectorAll('.current-room li') ?? [],
        (element) => element.textContent?.trim(),
      ),
    ).toEqual(TestBed.inject(GameSession).currentMessages);
  });

  it('shows a wall bump together with the perceptions of the same cell', async () => {
    const harness = await RouterTestingHarness.create('/setup');
    harness.routeNativeElement
      ?.querySelector<HTMLButtonElement>('app-setup-form button[type="submit"]')
      ?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    harness.routeNativeElement?.querySelector('app-game-grid')?.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        bubbles: true,
        cancelable: true,
      }),
    );
    harness.detectChanges();

    const currentRoomText =
      harness.routeNativeElement?.querySelector('.current-room')?.textContent ?? '';
    expect(currentRoomText).toContain('pared');
    expect(TestBed.inject(GameSession).currentMessages.length).toBeGreaterThan(1);
    expect(
      Array.from(
        harness.routeNativeElement?.querySelectorAll('.current-room li') ?? [],
        (element) => element.textContent?.trim(),
      ),
    ).toEqual(TestBed.inject(GameSession).currentMessages);
  });

  it('shoots with the space bar without scrolling the page', async () => {
    const harness = await RouterTestingHarness.create('/setup');
    harness.routeNativeElement
      ?.querySelector<HTMLButtonElement>('app-setup-form button[type="submit"]')
      ?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    const gameGrid = harness.routeNativeElement?.querySelector('app-game-grid');
    const event = new KeyboardEvent('keydown', {
      key: ' ',
      code: 'Space',
      bubbles: true,
      cancelable: true,
    });
    gameGrid?.dispatchEvent(event);
    harness.detectChanges();

    expect(event.defaultPrevented).toBeTrue();
    expect(
      harness.routeNativeElement?.querySelector('.stat:nth-child(3) strong')?.textContent,
    ).toContain('4');
    expect(harness.routeNativeElement?.querySelector('.stat:last-child strong')?.textContent).toBe(
      '1',
    );
    expect(harness.routeNativeElement?.textContent).toContain('Disparas una flecha');
  });

  it('toggles hidden board elements without ending the game', async () => {
    const harness = await RouterTestingHarness.create('/setup');
    harness.routeNativeElement
      ?.querySelector<HTMLButtonElement>('app-setup-form button[type="submit"]')
      ?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    const revealedCells = () =>
      harness.routeNativeElement?.querySelectorAll('app-game-grid .cell.revealed').length ?? 0;
    expect(revealedCells()).toBe(0);

    harness.routeNativeElement?.querySelector<HTMLButtonElement>('.visibility-toggle')?.click();
    harness.detectChanges();
    expect(revealedCells()).toBe(4);
    expect(harness.routeNativeElement?.querySelector('.visibility-toggle')?.textContent).toContain(
      'Ocultar elementos',
    );

    harness.routeNativeElement?.querySelector<HTMLButtonElement>('.visibility-toggle')?.click();
    harness.detectChanges();
    expect(revealedCells()).toBe(0);
  });

  it('allows starting a fresh game and returning to setup', async () => {
    const harness = await RouterTestingHarness.create('/setup');
    harness.routeNativeElement
      ?.querySelector<HTMLButtonElement>('app-setup-form button[type="submit"]')
      ?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    harness.routeNativeElement?.querySelector<HTMLButtonElement>('.restart-button')?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/setup');
    expect(harness.routeNativeElement?.textContent).toContain('Configura la expedición');
  });
});
