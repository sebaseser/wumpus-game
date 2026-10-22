import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameConfig, validateConfig } from '../../core/game-engine';

@Component({
  selector: 'app-setup-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form class="setup-form" (ngSubmit)="start()">
      <label>
        <span>Tamaño del tablero</span>
        <input
          name="size"
          type="number"
          min="2"
          step="1"
          required
          [(ngModel)]="config.size"
          aria-describedby="size-help"
        />
        <small id="size-help">Tablero cuadrado de al menos 2 × 2 casillas.</small>
      </label>
      <label>
        <span>Pozos</span>
        <input
          name="pitCount"
          type="number"
          min="0"
          [max]="maxPits"
          step="1"
          required
          [(ngModel)]="config.pitCount"
        />
        <small>Máximo para este tablero: {{ maxPits }}.</small>
      </label>
      <label>
        <span>Flechas</span>
        <input name="arrows" type="number" min="0" step="1" required [(ngModel)]="config.arrows" />
        <small>Puedes comenzar sin flechas.</small>
      </label>
      @if (errors.length) {
        <ul class="validation-errors" aria-live="polite">
          @for (error of errors; track error) {
            <li>{{ error }}</li>
          }
        </ul>
      }
      <button class="primary-button start-button" type="submit">
        Iniciar partida <span aria-hidden="true">→</span>
      </button>
    </form>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .setup-form {
        display: grid;
        gap: 1.15rem;
      }
      label {
        display: grid;
        gap: 0.45rem;
        color: #d7dfda;
        font-size: 0.92rem;
        font-weight: 650;
      }
      input {
        width: 100%;
        border: 1px solid #45584e;
        border-radius: 0.7rem;
        padding: 0.82rem 0.9rem;
        color: #f5f7f3;
        background: #101b17;
        font: inherit;
      }
      input:focus {
        outline: 2px solid #c6ed91;
        outline-offset: 2px;
      }
      small {
        color: #91a198;
        font-weight: 400;
      }
      .validation-errors {
        padding: 0.7rem 1rem 0.7rem 2rem;
        margin: 0;
        border-radius: 0.7rem;
        color: #ffc0aa;
        background: #552a23;
      }
      .primary-button {
        border: 0;
        border-radius: 0.75rem;
        color: #152016;
        background: #c6ed91;
        padding: 0.95rem 1.15rem;
        font: inherit;
        font-weight: 800;
        cursor: pointer;
      }
      .primary-button:hover {
        background: #d7f6ac;
      }
      .start-button {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 0.25rem;
      }
    `,
  ],
})
export class SetupForm {
  @Output() readonly begin = new EventEmitter<GameConfig>();
  config: GameConfig = { size: 5, pitCount: 2, arrows: 5 };

  get maxPits(): number {
    return Number.isInteger(this.config.size) && this.config.size >= 2
      ? this.config.size * this.config.size - 3
      : 0;
  }

  get errors(): string[] {
    return validateConfig(this.config);
  }

  start(): void {
    if (!this.errors.length) this.begin.emit({ ...this.config });
  }
}
