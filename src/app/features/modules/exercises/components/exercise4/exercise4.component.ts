import { TextService } from './../../services/text.service';
import { Component, AfterViewChecked, ElementRef, Input } from '@angular/core';
import { Exercise } from '../../model/exercise';
import { KeyboardService } from '../../services/keyboard.service';
import { ExercisesStateService } from '../../services/exercises-state.service';

@Component({
  selector: 'exercise4',
  templateUrl: './exercise4.component.html',
  styleUrls: ['./exercise4.component.scss'],
})
export class Exercise4Component extends Exercise implements AfterViewChecked {
  wordIndexes: number[] = [];

  constructor(
    state: ExercisesStateService,
    public readonly textService: TextService,
    keyService: KeyboardService,
    private el: ElementRef
  ) {
    super(keyService, state);
    for (
      let i = 0;
      i < this.state.bookService.phrasesWithNewlines.length;
      i++
    ) {
      if (
        !textService.isNewline(this.state.bookService.phrasesWithNewlines[i])
      ) {
        this.wordIndexes.push(i);
      }
    }
  }

  ngAfterViewChecked(): void {
    if (!this.state.finished) {
      const activeElement = this.el.nativeElement.querySelector('.active');
      this.state.activeElement = activeElement;
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.state.pageYPosition = 0;
  }
}
