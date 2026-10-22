import { TestBed } from '@angular/core/testing';
import { SetupForm } from './setup-form';

describe('SetupForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SetupForm] }).compileComponents();
  });

  it('prevents an invalid pit count from starting and emits a valid configuration', () => {
    const fixture = TestBed.createComponent(SetupForm);
    const form = fixture.componentInstance;
    spyOn(form.begin, 'emit');

    form.config = { size: 2, pitCount: 2, arrows: 0 };
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('como máximo 1 pozos');
    form.start();
    expect(form.begin.emit).not.toHaveBeenCalled();

    form.config = { size: 2, pitCount: 1, arrows: 0 };
    form.start();
    expect(form.begin.emit).toHaveBeenCalledWith({ size: 2, pitCount: 1, arrows: 0 });
  });

  it('rejects fractional and negative values before emitting', () => {
    const fixture = TestBed.createComponent(SetupForm);
    const form = fixture.componentInstance;
    spyOn(form.begin, 'emit');
    form.config = { size: 4, pitCount: 1.5, arrows: -1 };
    form.start();
    expect(form.begin.emit).not.toHaveBeenCalled();
    expect(form.errors.length).toBeGreaterThan(0);
  });
});
