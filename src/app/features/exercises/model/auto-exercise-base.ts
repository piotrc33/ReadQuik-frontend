import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Exercise } from './exercise';
import { ExerciseModeT } from './exercise-mode.type';
import { ResultsService } from 'src/app/shared/services/results.service';
import { SubscriptionContainer } from 'src/app/utils/subscription-container';
import { map, timer } from 'rxjs';
import { getAverageTimeoutMs } from 'src/app/utils/utils';
import { toSignal } from '@angular/core/rxjs-interop';
import { BookService } from '../../library/services/book.service';

@Component({
  template: '',
})
export class AutoExerciseBase extends Exercise implements OnInit, OnDestroy {
  readonly resultsService = inject(ResultsService);
  readonly bookService = inject(BookService);

  @Input()
  mode: ExerciseModeT = 'manual';

  autoSpeed = toSignal(
    this.resultsService.last3Avg$.pipe(map((avg) => avg * 1.2))
  );
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
