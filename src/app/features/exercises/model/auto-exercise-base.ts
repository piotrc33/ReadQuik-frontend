import { Component, Input, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { timer } from 'rxjs';
import { ResultsService } from 'src/app/shared/services/results.service';
import { SubscriptionContainer } from 'src/app/utils/subscription-container';
import { getAverageTimeoutMs } from 'src/app/utils/utils';
import { BookService } from '../../library/services/book.service';
import { Exercise } from './exercise';
import { ExerciseModeT } from './exercise-mode.type';

@Component({
  template: '',
})
export class AutoExerciseBase extends Exercise implements OnInit, OnDestroy {
  readonly resultsService = inject(ResultsService);
  readonly bookService = inject(BookService);

  @Input()
  mode: ExerciseModeT = 'manual';

  autoSpeed = computed(() => this.resultsService.last3Avg() * 1.2)
  subsContainer = new SubscriptionContainer();

  ngOnInit(): void {
    this.state.exerciseMode = this.mode;
    if (this.mode === 'auto') {
      this.startAutoTimer();
    }
  }

  startAutoTimer(): void {
    const currentSegment = this.bookService.currentSegment();
    if (currentSegment === null) {
      return;
    }
    const wordPhrases = this.bookService.wordPhrases();
    this.subsContainer.add = timer(
      getAverageTimeoutMs(
        currentSegment.text.length,
        wordPhrases.length,
        this.autoSpeed() || 200
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
    this.state.phraseNumber.set(0);
    this.state.pageYPosition = 0;
    this.state.progressPercent = 0;
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.state.exerciseMode = 'manual';
    this.subsContainer.dispose();
  }
}
