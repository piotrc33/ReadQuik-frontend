import { AfterViewChecked, Component, ElementRef, OnInit } from '@angular/core';
import { TextService } from '../../services/text.service';
import { Exercise } from '../../model/exercise';
import { KeyboardService } from '../../services/keyboard.service';
import { ExerciseModeT } from '../../model/exercise-mode.type';
import { ExercisesStateService } from '../../services/exercises-state.service';
import { getTimeoutMs } from 'src/app/utils/utils';

@Component({
  selector: 'exercise3',
  templateUrl: './exercise3.component.html',
  styleUrls: ['./exercise3.component.scss'],
})
export class Exercise3Component
  extends Exercise
  implements AfterViewChecked, OnInit
{
  leftOffset: number = 180;
  phraseWidth?: number;

  mode: ExerciseModeT = 'auto';

  constructor(
    private el: ElementRef,
    state: ExercisesStateService,
    textService: TextService,
    keyService: KeyboardService
  ) {
    super(textService, keyService, state);
  }

  ngAfterViewChecked(): void {
    const activeElement = this.el.nativeElement.querySelector('.active');
    this.phraseWidth = activeElement.offsetWidth;
  }

  ngOnInit(): void {
    if (this.mode === 'auto') {
      this.nextFragmentTimeout();
    }
  }

  override handleForwardingKey(): void {
    if (this.mode === 'manual') {
      this.handleNextFragment();
    }
  }

  handleNextFragment(): void {
    this.nextFragment();
    this.leftOffset -= this.phraseWidth!;

    if (this.mode === 'auto') {
      if (this.state.finished) {
        this.reset();
        this.mode = 'manual';
      } else {
        this.nextFragmentTimeout();
      }
    }
    
    if (this.mode === 'manual' && this.state.finished) {
      this.state.end();
    }
  }

  nextFragmentTimeout(): void {
    setTimeout(
      () => this.handleNextFragment(),
      getTimeoutMs(
        this.state.bookFragments[this.state.phraseNumber].length,
        200
      )
    );
  }

  reset(): void {
    this.state.phraseNumber = 0;
    this.leftOffset = 180;
  }
}
