import { TextService } from './../../services/text.service';
import { Component, AfterViewChecked, ElementRef } from '@angular/core';
import { Exercise } from '../../model/exercise';
import { KeyboardService } from '../../services/keyboard.service';
import { ExercisesStateService } from '../../services/exercises-state.service';

@Component({
  selector: 'app-exercise4',
  templateUrl: './exercise4.component.html',
  styleUrls: ['./exercise4.component.scss'],
})
export class Exercise4Component extends Exercise implements AfterViewChecked {

  wordIndexes: number[] = []
  i: number = 0;

  constructor(
    state: ExercisesStateService,
    public readonly textService: TextService,
    keyService: KeyboardService,
    private el: ElementRef,
  ) {
    super(keyService, state);
    for(let i = 0; i < this.state.bookFragmentsWithNewlines.length; i++) {
      if(!textService.isNewline(this.state.bookFragmentsWithNewlines[i])) {
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

  override handleNextFragment(): void {
    this.i++;
    this.state.phraseNumber = this.currentIndex;
  }

  get currentIndex(): number {
    return this.wordIndexes[this.i];
  }
}
