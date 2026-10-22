import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { GameSession } from '../../core/game-session';
import { SetupView } from './setup-view';

describe('SetupView', () => {
  it('starts a game session and navigates to the play route', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    const fixture = TestBed.createComponent(SetupView);
    fixture.detectChanges();

    fixture.componentInstance.startGame({ size: 4, pitCount: 1, arrows: 2 });

    expect(TestBed.inject(GameSession).game?.size).toBe(4);
    expect(navigate).toHaveBeenCalledWith(['/play']);
  });
});
