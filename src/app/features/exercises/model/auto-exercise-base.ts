import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { filter, interval, takeUntil, tap } from 'rxjs';

import { getAverageTimeoutMs } from 'src/app/utils/utils';
import { BookService } from '../../library/services/book.service';
import { RecentResultsState } from '../services/recent-results/recent-results.state';
import { Exercise } from './exercise';
import { ExerciseModeT } from './exercise-mode.type';

@Component({
  template: '',
})
export class AutoExerciseBase extends Exercise implements OnInit, OnDestroy {
  readonly recentResultsState = inject(RecentResultsState);
  readonly bookService = inject(BookService);

  @Input()
  mode: ExerciseModeT = 'manual';

  autoSpeed = computed(() => this.recentResultsState.last3Avg() * 1.2);

  nextPhraseInterval$ = interval(
    getAverageTimeoutMs(
      this.bookService.currentSegment()?.text.length ?? 0,
      this.bookService.wordPhrases().length,
      this.autoSpeed()
    )
  ).pipe(
    filter(() => this.flowService.exerciseMode() === 'auto'),
    takeUntil(this.flowService.completedAutoMode$),
    tap(() => {
      this.flowService.autoNextAction$.next();
      this.flowService.startTime = Date.now();
    })
  );

  ngOnInit(): void {
    this.subs.add = this.nextPhraseInterval$.subscribe();
    this.flowService.exerciseMode.set(this.mode);
  }
}
