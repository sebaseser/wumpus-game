import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-perception-log',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <section class="log-card">
      <h2>Bitácora</h2>
      <ol aria-live="polite" aria-relevant="additions">
        @for (entry of entries; track $index) {
          <li [class.latest]="$last"><span class="entry-number">{{ entries.length - $index }}</span>{{ entry }}</li>
        }
      </ol>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .log-card { border: 1px solid #34473c; border-radius: .9rem; background: #14211b; overflow: hidden; }
    h2 { margin: 0; padding: .9rem 1rem; border-bottom: 1px solid #34473c; color: #d8e4d9; font-size: 1rem; }
    ol { display: flex; flex-direction: column-reverse; gap: .65rem; max-height: 15rem; overflow: auto; list-style: none; margin: 0; padding: .8rem; }
    li { display: flex; align-items: flex-start; gap: .6rem; color: #aebbb1; font-size: .82rem; line-height: 1.45; }
    li.latest { color: #f4f7ef; }
    .entry-number { flex: 0 0 1.35rem; display: grid; place-items: center; width: 1.35rem; height: 1.35rem; border-radius: 50%; color: #aabd9e; background: #293a2e; font-size: .7rem; }
  `],
})
export class PerceptionLog {
  @Input() entries: string[] = [];
}
