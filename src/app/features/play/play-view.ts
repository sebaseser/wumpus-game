import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  HostListener,
  inject,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Facing } from '../../core/game-engine';
import { GameSession } from '../../core/game-session';
import { GameAction, GameControls } from '../../shared/components/game-controls';
import { GameGrid } from '../../shared/components/game-grid';
import { GameStatus } from '../../shared/components/game-status';
import { PerceptionLog } from '../../shared/components/perception-log';

@Directive({ selector: 'dialog[appModalDialog]', standalone: true })
export class ModalDialog implements AfterViewInit {
  private readonly element = inject<ElementRef<HTMLDialogElement>>(ElementRef);

  ngAfterViewInit(): void {
    this.element.nativeElement.showModal?.();
  }
}

@Component({
  selector: 'app-play-view',
  standalone: true,
  imports: [RouterLink, GameGrid, GameControls, GameStatus, PerceptionLog, ModalDialog],
  templateUrl: './play-view.html',
})
export class PlayView {
  showHiddenElements = false;
  readonly gameSession = inject(GameSession);
  private readonly router = inject(Router);

  perform(action: GameAction): void {
    this.gameSession.perform(action);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    const game = this.gameSession.game;
    if (!game || game.outcome !== 'playing' || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    const target = event.target;
    if (
      target instanceof HTMLElement &&
      target.closest('input, textarea, select, [contenteditable="true"]')
    ) {
      return;
    }

    if (event.key === ' ' || event.code === 'Space') {
      event.preventDefault();
      if (!event.repeat) this.perform('shoot');
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (!event.repeat) this.perform('exit');
      return;
    }

    const directions: Partial<Record<string, Facing>> = {
      ArrowUp: 'N',
      ArrowRight: 'E',
      ArrowDown: 'S',
      ArrowLeft: 'W',
    };
    const facing = directions[event.key];
    if (!facing) return;

    event.preventDefault();
    this.gameSession.moveInDirection(facing);
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    // Evita que Espacio active además el botón que tenga el foco.
    if (event.key === ' ' || event.code === 'Space') event.preventDefault();
  }

  newGame(): void {
    this.showHiddenElements = false;
    this.gameSession.reset();
    void this.router.navigate(['/setup']);
  }
}
