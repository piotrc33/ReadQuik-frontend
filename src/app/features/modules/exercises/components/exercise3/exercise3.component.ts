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
    this.state.exerciseMode = 'auto';
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

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.state.exerciseMode = 'manual';
  }

  nextFragmentTimeout(): void {
    setTimeout(
      () => this.handleAutoNextFragment(),
      getTimeoutMs(
        this.state.bookFragments[this.state.phraseNumber].length,
        200
      )
    );
  }

  handleAutoNextFragment(): void {
    this.nextFragment();
    this.leftOffset -= this.phraseWidth!;
    if (this.state.finished) {
      this.reset();
      this.mode = 'manual';
      this.state.exerciseMode = 'manual';
    } else {
      this.nextFragmentTimeout();
    }
  }

  override handleNextFragment(): void {
    if(this.mode === 'manual') {
      this.nextFragment();
      this.leftOffset -= this.phraseWidth!;
      if(this.state.finished) {
        this.state.end();
      }
    }
  }

  reset(): void {
    this.state.phraseNumber = 0;
    this.leftOffset = 180;
  }
}
