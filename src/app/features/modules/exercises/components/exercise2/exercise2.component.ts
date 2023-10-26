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
  leftOffset: number = 50;
  phraseWidth?: number;

  constructor(
    private el: ElementRef,
    keyboardService: KeyboardService,
    state: ExercisesStateService
  ) {
    super(keyboardService, state);
  }

  ngOnInit(): void {
    this.leftOffset = this.getDefaultOffset('.exercise2');
  }

  ngAfterViewChecked(): void {
    if (!this.state.finished) {
      const activeElement = this.el.nativeElement.querySelector('.active');
      this.phraseWidth = activeElement.offsetWidth;
    }
  }

  override handleNextFragment(): void {
    super.handleNextFragment();
    this.leftOffset -= this.phraseWidth!;
  }

  getDefaultOffset(selector: string): number {
    const container = this.el.nativeElement.querySelector(selector);
    return container.offsetWidth / 2 - 75;
  }
}
