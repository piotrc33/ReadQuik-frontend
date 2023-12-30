import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';
import { timer } from 'rxjs';
import { ResultsService } from 'src/app/features/services/results.service';
import { SubscriptionContainer } from 'src/app/utils/subscription-container';
import { getAverageTimeoutMs } from 'src/app/utils/utils';
import { Exercise } from '../../model/exercise';
import { ExerciseModeT } from '../../model/exercise-mode.type';

@Component({
  selector: 'exercise2',
  templateUrl: './exercise2.component.html',
  styleUrls: ['./exercise2.component.scss'],
})
export class Exercise2Component
  extends Exercise
  implements AfterViewChecked, OnInit
{
  @Input()
  mode: ExerciseModeT = 'manual';

  leftOffset: number = 50;
  phraseWidth?: number;

  wpmSpeed?: number;
  subsContainer = new SubscriptionContainer();

  constructor(
    private readonly el: ElementRef,
    private readonly resultsService: ResultsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.state.exerciseMode = this.mode;
    this.subsContainer.add = this.resultsService.last3Avg$.subscribe(
      (val) => (this.wpmSpeed = val * 1.2)
    );
    if (this.mode === 'auto') {
      this.startAutoTimer();
    }
    this.leftOffset = this.getDefaultOffset('.exercise2');
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.state.exerciseMode = 'manual';
    this.subsContainer.dispose();
  }

  startAutoTimer(): void {
    if (this.state.bookService.currentSegment === null) {
      return;
    }
    this.subsContainer.add = timer(
      getAverageTimeoutMs(
        this.state.bookService.currentSegment.text.length,
        this.state.bookService.wordPhrases.length,
        this.wpmSpeed || 200
      )
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
      this.leftOffset -= this.phraseWidth!;
    }
  }

  reset(): void {
    this.state.phraseNumber = 0;
    this.leftOffset = this.getDefaultOffset('.exercise2');
  }

  ngAfterViewChecked(): void {
    if (!this.state.finished) {
      const activeElement = this.el.nativeElement.querySelector('.active');
      this.phraseWidth = activeElement.offsetWidth;
    }
  }

  getDefaultOffset(selector: string): number {
    const container = this.el.nativeElement.querySelector(selector);
    return container.offsetWidth / 2 - 75;
  }
}
