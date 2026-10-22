import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
  });

  it('renders the Spanish expedition setup with suggested defaults', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Configura la expedición');
    expect(text).toContain('Pozos');
    expect(text).toContain('Flechas');
    expect(text).not.toContain('Hello, wumpus-game');
  });

  it('starts a playable game and displays the map, perceptions, status, and controls', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const startButton = (fixture.nativeElement as HTMLElement).querySelector(
      'app-setup-form button[type="submit"]',
    ) as HTMLButtonElement;
    startButton.click();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Mapa de la cueva');
    expect(text).toContain('Acciones');
    expect(text).toContain('Disparar');
    expect(text).toContain('Bitácora');
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('[role="gridcell"]').length).toBe(25);
  });

  it('updates the action count when a control is used', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('app-setup-form button[type="submit"]')!
      .click();
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('app-game-controls button[aria-label="Girar a la izquierda"]')!
      .click();
    fixture.detectChanges();
    expect(fixture.componentInstance.game?.actions).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Este');
  });
});
