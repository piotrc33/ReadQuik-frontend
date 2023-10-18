import {
  AfterViewChecked,
  Component,
  ElementRef,
} from '@angular/core';
import { TextService } from '../../services/text.service';
import { Exercise } from '../../model/exercise';
import { KeyboardService } from '../../services/keyboard.service';
import { ExercisesStateService } from '../../services/exercises-state.service';

@Component({
  selector: 'exercise2',
  templateUrl: './exercise2.component.html',
  styleUrls: ['./exercise2.component.scss'],
})
export class Exercise2Component extends Exercise implements AfterViewChecked {
  leftOffset: number = 180;
  phraseWidth?: number;

  constructor(
    private el: ElementRef,
    state: ExercisesStateService,
    textService: TextService,
    keyboardService: KeyboardService,
  ) {
    super(textService, keyboardService, state);
  }

  ngAfterViewChecked(): void {
    if(!this.state.finished) {
      const activeElement = this.el.nativeElement.querySelector('.active');
      this.phraseWidth = activeElement.offsetWidth;
    }
  }

  override handleNextFragment(): void {
    super.handleNextFragment();
    this.leftOffset -= this.phraseWidth!;
  }
}
