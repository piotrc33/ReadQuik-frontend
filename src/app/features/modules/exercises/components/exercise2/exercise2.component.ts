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
    private state: ExercisesStateService,
    textService: TextService,
    keyboardService: KeyboardService,
  ) {
    super(textService, keyboardService);
  }

  ngAfterViewChecked(): void {
    const activeElement = this.el.nativeElement.querySelector('.active');
    this.phraseWidth = activeElement.offsetWidth;
  }

  override handleForwardingKey(): void {
    this.nextFragment();
    this.leftOffset -= this.phraseWidth!;
    if (this.finished) {
      this.state.started = false;
    }
  }

  nextFragment() {
    this.phraseNumber++;
  }
}
