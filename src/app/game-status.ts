import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Facing, WumpusGame } from './game-engine';

@Component({
  selector: 'app-game-status',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <section class="stats" aria-label="Estado de la expedición">
      <div class="stat"><span>Dirección</span><strong>{{ facingNames[game.facing] }} <b aria-hidden="true">{{ facingIcons[game.facing] }}</b></strong></div>
      <div class="stat"><span>Oro</span><strong>{{ game.hasGold ? 'Conseguido' : 'Pendiente' }} {{ game.hasGold ? '✦' : '◇' }}</strong></div>
      <div class="stat"><span>Flechas</span><strong>{{ game.arrows }} 🏹</strong></div>
      <div class="stat"><span>Acciones</span><strong>{{ game.actions }}</strong></div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .5rem; }
    .stat { min-width: 0; display: grid; gap: .3rem; padding: .75rem .6rem; border: 1px solid #34473c; border-radius: .75rem; background: #14211b; }
    .stat span { color: #91a198; font-size: .72rem; }
    .stat strong { color: #eff5ed; font-size: .86rem; white-space: nowrap; }
    @media (max-width: 520px) { .stats { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  `],
})
export class GameStatus {
  @Input({ required: true }) game!: WumpusGame;
  protected readonly facingNames: Record<Facing, string> = { N: 'Norte', E: 'Este', S: 'Sur', W: 'Oeste' };
  protected readonly facingIcons: Record<Facing, string> = { N: '↑', E: '→', S: '↓', W: '←' };
}
