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

  constructor(
    state: ExercisesStateService,
    public readonly textService: TextService,
    keyService: KeyboardService,
    private el: ElementRef,
  ) {
    super(keyService, state);
  }

  ngAfterViewChecked(): void {
    if (!this.state.finished) {
      const activeElement = this.el.nativeElement.querySelector('.active');
      this.state.activeElement = activeElement;
    }
  }

  getPhraseIndex(phrase: string): number {
    return this.state.wordFragments.indexOf(phrase);
  }
}
