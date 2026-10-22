import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-perception-log',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <section class="log-card">
      <h2>Bitácora</h2>
      <ul #entriesList aria-live="polite" aria-relevant="additions">
        @for (entry of newestFirst; track $index) {
          <li [class.latest]="$first">{{ entry }}</li>
        }
      </ul>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .log-card {
        border: 1px solid #34473c;
        border-radius: 0.9rem;
        background: #14211b;
        overflow: hidden;
      }
      h2 {
        margin: 0;
        padding: 0.9rem 1rem;
        border-bottom: 1px solid #34473c;
        color: #d8e4d9;
        font-size: 1rem;
      }
      ul {
        max-height: 15rem;
        overflow: auto;
        list-style: disc;
        list-style-position: outside;
        margin: 0;
        padding: 0.8rem 0.8rem 0.8rem 2rem;
      }
      li {
        padding: 0.35rem 0.4rem;
        border-radius: 0.4rem;
        color: #aebbb1;
        font-size: 0.82rem;
        line-height: 1.45;
      }
      li + li {
        margin-top: 0.3rem;
      }
      li::marker {
        color: #71847a;
      }
      li.latest {
        color: #f4f7ef;
        background: #26372d;
        font-weight: 650;
      }
      li.latest::marker {
        color: #c6ed91;
      }
    `,
  ],
})
export class PerceptionLog {
  private entryList: string[] = [];

  @ViewChild('entriesList') private entriesList?: ElementRef<HTMLUListElement>;

  @Input()
  set entries(value: string[]) {
    this.entryList = value;
    if (this.entriesList) this.entriesList.nativeElement.scrollTop = 0;
  }

  get newestFirst(): string[] {
    return [...this.entryList].reverse();
  }
}
