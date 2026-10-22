import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export type GameAction = 'forward' | 'left' | 'right' | 'shoot' | 'exit';

@Component({
  selector: 'app-game-controls',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <section class="controls" aria-label="Acciones del cazador">
      <div class="move-controls">
        <button
          type="button"
          (click)="action.emit('left')"
          [disabled]="disabled"
          aria-label="Girar a la izquierda"
        >
          ↶ <span>Izquierda</span>
        </button>
        <button
          type="button"
          class="forward"
          (click)="action.emit('forward')"
          [disabled]="disabled"
          aria-label="Avanzar"
        >
          ↑ <span>Avanzar</span>
        </button>
        <button
          type="button"
          (click)="action.emit('right')"
          [disabled]="disabled"
          aria-label="Girar a la derecha"
        >
          ↷ <span>Derecha</span>
        </button>
      </div>
      <button
        type="button"
        class="secondary-action"
        (click)="action.emit('shoot')"
        [disabled]="disabled || arrows === 0"
        aria-keyshortcuts="Space"
      >
        <span>🏹 Disparar</span> <kbd>Espacio</kbd>
      </button>
      <button
        type="button"
        class="exit-action"
        (click)="action.emit('exit')"
        [disabled]="disabled"
        aria-keyshortcuts="Enter"
      >
        <span>🚪 Salir</span> <kbd>Enter</kbd>
      </button>
      @if (arrows === 0) {
        <p class="hint">No quedan flechas para disparar.</p>
      }
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .controls {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.65rem;
        padding: 1rem;
        border: 1px solid #526b56;
        border-radius: 1rem;
        background: linear-gradient(180deg, #1b2c22, #13211a);
        box-shadow:
          0 0 1.2rem #c6ed9120,
          inset 0 1px 0 #ffffff12;
      }
      .move-controls {
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.55rem;
      }
      button {
        min-height: 3.1rem;
        border: 1px solid #5d7566;
        border-radius: 0.75rem;
        color: #f1f7f1;
        background: #23372c;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 2px 0 #0a120e;
      }
      button:hover:not(:disabled) {
        border-color: #c6ed91;
        background: #2e4637;
      }
      button:active:not(:disabled) {
        transform: translateY(1px);
        box-shadow: none;
      }
      button:focus-visible {
        outline: 2px solid #c6ed91;
        outline-offset: 2px;
      }
      button:disabled {
        cursor: not-allowed;
        opacity: 0.45;
      }
      .forward {
        color: #152016;
        border-color: #c6ed91;
        background: #c6ed91;
      }
      .secondary-action,
      .exit-action {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.2rem;
        padding: 0.65rem;
      }
      .exit-action {
        color: #ffd3ad;
      }
      kbd {
        margin: 0;
        padding: 0.1rem 0.4rem;
        border: 1px solid #5d7566;
        border-radius: 0.3rem;
        color: #b8c8bb;
        background: #0f1a14;
        font: inherit;
        font-size: 0.68rem;
        font-weight: 600;
      }
      .hint {
        grid-column: 1 / -1;
        color: #9cab9f;
        margin: 0;
        font-size: 0.8rem;
      }
      @media (max-width: 440px) {
        button span {
          display: block;
          font-size: 0.73rem;
        }
      }
    `,
  ],
})
export class GameControls {
  @Input() disabled = false;
  @Input() arrows = 0;
  @Output() readonly action = new EventEmitter<GameAction>();
}
