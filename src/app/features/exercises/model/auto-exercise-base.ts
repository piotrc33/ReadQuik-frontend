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
    this.flowService.exerciseMode.set(this.mode);
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
        this.autoSpeed()
      )
    ).subscribe(() => {
      this.handleAutoNextFragment();
    });
  }

  handleAutoNextFragment(): void {
    this.flowService.autoNextAction$.next();
    if (this.flowService.completedAutoMode()) {
      this.flowService.exerciseMode.set('manual');
      this.flowService.startTime = Date.now();
    } else {
      this.startAutoTimer();
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.flowService.exerciseMode.set('manual');
    this.subsContainer.dispose();
  }
}
