import { AfterViewInit, Component, ElementRef, inject } from '@angular/core';
import { filter, merge } from 'rxjs';
import { AutoExerciseBase } from '../../model/auto-exercise-base';
import { TextService } from '../../services/text.service';

@Component({
  selector: 'exercise7',
  templateUrl: './exercise7.component.html',
  styleUrls: ['./exercise7.component.scss'],
})
export class Exercise7Component
  extends AutoExerciseBase
  implements AfterViewInit
{
  readonly textService = inject(TextService);
  readonly el = inject(ElementRef);

  exerciseTextElement?: HTMLElement;
  textBox?: DOMRect;
  panelBox?: DOMRect;
  toScroll: number = 0;

  override finished$ = merge(
    this.keyService.forwardingPress$,
    this.state.next$
  ).pipe(filter(() => this.isLastPage()));

  constructor() {
    super();
    this.subs.add = this.finished$.subscribe(() => this.state.finish());
  }

  wordIndexes: number[] = [];
  override ngOnInit(): void {
    super.ngOnInit();
    for (
      let i = 0;
      i < this.state.bookService.phrasesWithNewlines().length;
      i++
    ) {
      if (
        !this.textService.isNewline(
          this.state.bookService.phrasesWithNewlines()[i]
        )
      ) {
        this.wordIndexes.push(i);
      }
    }
  }

  ngAfterViewInit(): void {
    this.panelBox = this.state.panelContentElement?.getBoundingClientRect();
    this.exerciseTextElement = this.el.nativeElement.querySelector('.text');
    this.textBox = this.exerciseTextElement?.getBoundingClientRect();
    this.toScroll = this.textBox!.bottom - this.panelBox!.bottom + 360;
  }

  override handleNextFragment(): void {
    this.nextPage();
    super.handleNextFragment();
  }

  isLastPage(): boolean {
    const result = this.textBox!.bottom < this.panelBox!.bottom;
    this.textBox = this.exerciseTextElement?.getBoundingClientRect();
    return result;
  }

  nextPage() {
    this.panelBox = this.state.panelContentElement?.getBoundingClientRect();
    this.state.pageYPosition -= this.panelBox!.height;
  }

  ngAfterViewChecked(): void {
    if (!this.state.finished) {
      const activeElement = this.el.nativeElement.querySelector('.active');
      this.state.activeElement = activeElement;
    }
  }

  override nextFragment(): void {
    if (this.state.exerciseMode === 'manual') {
      this.state.progressPercent = Math.round(
        (-this.state.pageYPosition / this.toScroll) * 100
      );
      if (this.state.progressPercent > 100) {
        this.state.progressPercent = 100;
      }
    } else {
      super.nextFragment();
    }
  }
}
