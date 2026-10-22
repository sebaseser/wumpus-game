import { TestBed } from '@angular/core/testing';
import { PerceptionLog } from './perception-log';

describe('PerceptionLog', () => {
  it('shows new records first as bullets and highlights the latest record', async () => {
    await TestBed.configureTestingModule({
      imports: [PerceptionLog],
    }).compileComponents();
    const fixture = TestBed.createComponent(PerceptionLog);
    fixture.componentRef.setInput('entries', ['Registro anterior', 'Registro nuevo']);
    fixture.detectChanges();

    const list = fixture.nativeElement.querySelector('ul') as HTMLUListElement;
    const records = Array.from(list.querySelectorAll('li'));

    expect(list).not.toBeNull();
    expect(list.tagName).toBe('UL');
    expect(records.map((record) => record.textContent?.trim())).toEqual([
      'Registro nuevo',
      'Registro anterior',
    ]);
    expect(records[0]?.classList.contains('latest')).toBeTrue();
    expect(records[1]?.classList.contains('latest')).toBeFalse();
    expect(list.textContent).not.toContain('1');
  });

  it('scrolls back to the top when a new record is added', async () => {
    await TestBed.configureTestingModule({
      imports: [PerceptionLog],
    }).compileComponents();
    const fixture = TestBed.createComponent(PerceptionLog);
    fixture.componentRef.setInput('entries', ['Registro inicial']);
    fixture.detectChanges();

    const list = fixture.nativeElement.querySelector('ul') as HTMLUListElement;
    list.scrollTop = 100;
    fixture.componentRef.setInput('entries', ['Registro inicial', 'Registro nuevo']);
    fixture.detectChanges();

    expect(list.scrollTop).toBe(0);
    expect(list.querySelector('li')?.textContent?.trim()).toBe('Registro nuevo');
  });
});
