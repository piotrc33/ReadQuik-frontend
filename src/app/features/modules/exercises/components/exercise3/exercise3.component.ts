import { AfterViewChecked, Component, ElementRef, OnInit } from '@angular/core';
import { TextService } from '../../services/text.service';
import { Exercise } from '../../model/exercise';
import { KeyboardService } from '../../services/keyboard.service';
import { ExercisesStateService } from '../../services/exercises-state.service';
import { getTimeoutMs } from 'src/app/utils/utils';
import { Subscription, timer } from 'rxjs';

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

  wpmSpeed: number = 200;
  private timerSub?: Subscription;

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
    if(!this.state.finished) {
      const activeElement = this.el.nativeElement.querySelector('.active');
      this.phraseWidth = activeElement.offsetWidth;
    }
  }

  ngOnInit(): void {
    this.startAutoTimer();
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
    } else {
      this.startAutoTimer();
    }
  }

  override handleNextFragment(): void {
    if (this.state.exerciseMode === 'manual') {
      super.handleNextFragment();
      this.leftOffset -= this.phraseWidth!;
    }
  }

  reset(): void {
    this.state.phraseNumber = 0;
    this.leftOffset = 180;
  }
}
