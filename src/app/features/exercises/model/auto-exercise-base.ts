import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Exercise } from './exercise';
import { ExerciseModeT } from './exercise-mode.type';
import { ResultsService } from 'src/app/services/results.service';
import { SubscriptionContainer } from 'src/app/utils/subscription-container';
import { timer } from 'rxjs';
import { getAverageTimeoutMs } from 'src/app/utils/utils';

@Component({
  template: '',
})
export class AutoExerciseBase extends Exercise implements OnInit, OnDestroy {
  readonly resultsService = inject(ResultsService);

  @Input()
  mode: ExerciseModeT = 'manual';

  wpmSpeed?: number;
  subsContainer = new SubscriptionContainer();

  ngOnInit(): void {
    this.subsContainer.add = this.resultsService.last3Avg$.subscribe((val) => {
      this.wpmSpeed = val * 1.2;
    });
    this.state.exerciseMode = this.mode;
    if (this.mode === 'auto') {
      this.startAutoTimer();
    }
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
    if (this.state.finished) {
      this.reset();
      this.state.exerciseMode = 'manual';
      this.state.startTime = Date.now();
    } else {
      this.startAutoTimer();
    }
  }

  reset(): void {
    this.state.phraseNumber = 0;
    this.state.pageYPosition = 0;
    this.state.progressPercent = 0;
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.state.exerciseMode = 'manual';
    this.subsContainer.dispose();
  }
}
