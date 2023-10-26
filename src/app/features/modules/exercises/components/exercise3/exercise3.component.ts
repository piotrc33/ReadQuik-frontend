import { AfterViewChecked, Component, ElementRef, OnInit } from '@angular/core';
import { KeyboardService } from '../../services/keyboard.service';
import { ExercisesStateService } from '../../services/exercises-state.service';
import { getTimeoutMs } from 'src/app/utils/utils';
import { Subscription, timer } from 'rxjs';
import { Exercise2Component } from '../exercise2/exercise2.component';

@Component({
  selector: 'exercise3',
  templateUrl: './exercise3.component.html',
  styleUrls: ['./exercise3.component.scss'],
})
export class Exercise3Component
  extends Exercise2Component
  implements AfterViewChecked, OnInit
{

  wpmSpeed: number = 200;
  private timerSub?: Subscription;

  constructor(
    el: ElementRef,
    state: ExercisesStateService,
    keyService: KeyboardService
  ) {
    super(el, keyService, state);
    this.state.exerciseMode = 'auto';
  }

  override ngOnInit(): void {
    this.startAutoTimer();
    this.leftOffset = this.getDefaultOffset('.exercise3');
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.state.exerciseMode = 'manual';
    this.timerSub?.unsubscribe();
  }

  startAutoTimer(): void {
    this.timerSub?.unsubscribe();
    this.timerSub = timer(
      getTimeoutMs(this.state.currentPhrase.length, this.wpmSpeed)
    ).subscribe(() => {
      this.handleAutoNextFragment();
    });
  }

  handleAutoNextFragment(): void {
    this.nextFragment();
    this.leftOffset -= this.phraseWidth!;
    if (this.state.finished) {
      this.reset();
      this.state.exerciseMode = 'manual';
      this.state.startTime = Date.now();
    } else {
      this.startAutoTimer();
    }
  }

  override handleNextFragment(): void {
    if (this.state.exerciseMode === 'manual') {
      super.handleNextFragment();
    }
  }

  reset(): void {
    this.state.phraseNumber = 0;
    this.leftOffset = this.getDefaultOffset('.exercise3');
  }

}
