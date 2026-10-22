import { TestBed } from '@angular/core/testing';
import { GameAction, GameControls } from './game-controls';

describe('GameControls', () => {
  const create = (disabled = false, arrows = 2) => {
    const fixture = TestBed.createComponent(GameControls);
    fixture.componentRef.setInput('disabled', disabled);
    fixture.componentRef.setInput('arrows', arrows);
    fixture.detectChanges();
    const emitted: GameAction[] = [];
    fixture.componentInstance.action.subscribe((action) => emitted.push(action));
    const buttons = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('button'),
    ) as HTMLButtonElement[];
    return { fixture, emitted, buttons };
  };

  it('emits the matching action for every button', () => {
    const { emitted, buttons } = create();
    buttons.forEach((button) => button.click());

    expect(emitted).toEqual(['left', 'forward', 'right', 'shoot', 'exit']);
  });

  it('shows the keyboard shortcuts for shoot and exit', () => {
    const { buttons } = create();

    expect(buttons[3].textContent).toContain('Espacio');
    expect(buttons[4].textContent).toContain('Enter');
  });

  it('disables every button when disabled', () => {
    const { buttons } = create(true);

    expect(buttons.every((button) => button.disabled)).toBeTrue();
  });

  it('disables shooting and shows a hint when no arrows are left', () => {
    const { fixture, buttons } = create(false, 0);

    expect(buttons[3].disabled).toBeTrue();
    expect(buttons[4].disabled).toBeFalse();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('No quedan flechas');
  });
});
