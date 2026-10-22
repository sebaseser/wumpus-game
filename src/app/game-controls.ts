import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export type GameAction = 'forward' | 'left' | 'right' | 'shoot' | 'exit';

@Component({
  selector: 'app-game-controls',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <section class="controls" aria-label="Acciones del cazador">
      <div class="move-controls">
        <button type="button" (click)="action.emit('left')" [disabled]="disabled" aria-label="Girar a la izquierda">↶ <span>Izquierda</span></button>
        <button type="button" class="forward" (click)="action.emit('forward')" [disabled]="disabled" aria-label="Avanzar">↑ <span>Avanzar</span></button>
        <button type="button" (click)="action.emit('right')" [disabled]="disabled" aria-label="Girar a la derecha">↷ <span>Derecha</span></button>
      </div>
      <button type="button" class="secondary-action" (click)="action.emit('shoot')" [disabled]="disabled || arrows === 0">🏹 <span>Disparar</span></button>
      <button type="button" class="exit-action" (click)="action.emit('exit')" [disabled]="disabled">🚪 <span>Salir</span></button>
      @if (arrows === 0) { <p class="hint">No quedan flechas para disparar.</p> }
    </section>
  `,
  styles: [`
    :host { display: block; }
    .controls { display: grid; grid-template-columns: 1fr 1fr; gap: .65rem; }
    .move-controls { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(3, 1fr); gap: .55rem; }
    button { min-height: 3.1rem; border: 1px solid #45594e; border-radius: .75rem; color: #e9f0e9; background: #1a2922; font: inherit; font-weight: 700; cursor: pointer; }
    button:hover:not(:disabled) { border-color: #c6ed91; background: #25382d; }
    button:focus-visible { outline: 2px solid #c6ed91; outline-offset: 2px; }
    button:disabled { cursor: not-allowed; opacity: .45; }
    .forward { color: #152016; border-color: #c6ed91; background: #c6ed91; }
    .secondary-action, .exit-action { padding: .65rem; }
    .exit-action { color: #ffd3ad; }
    .hint { grid-column: 1 / -1; color: #9cab9f; margin: 0; font-size: .8rem; }
    @media (max-width: 440px) { button span { display: block; font-size: .73rem; } }
  `],
})
export class GameControls {
  @Input() disabled = false;
  @Input() arrows = 0;
  @Output() readonly action = new EventEmitter<GameAction>();
}
