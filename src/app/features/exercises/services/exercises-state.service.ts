import { Injectable, inject } from '@angular/core';
import { filter, map } from 'rxjs';
import { ExercisesProgressStateService } from 'src/app/shared/services/exercises-progress-state.service';
import { calculateSpeed } from 'src/app/utils/utils';
import { BookService } from '../../library/services/book.service';
import { CurrentExerciseService } from './../../../shared/services/current-exercise.service';
import { ExerciseFlowService } from './exercise-flow.service';

@Injectable()
export class ExercisesStateService {
  private readonly flowService = inject(ExerciseFlowService);
  private readonly progressService = inject(ExercisesProgressStateService);

  panelContentElement?: HTMLElement;
  activeElement?: HTMLElement;

  constructor(
    private readonly bookService: BookService,
    private readonly currentExerciseService: CurrentExerciseService
  ) {}

  private readonly userWpm$ = this.flowService.completedManualMode$.pipe(
    map(() => {
      const wpm = calculateSpeed(
        this.flowService.startTime,
        this.bookService.wordPhrases()
      );
      return wpm;
    })
  );

  readonly shouldSave$ = this.userWpm$.pipe(
    filter(
      (wpm) => wpm < 1000 && this.progressService.isCurrentExerciseUnlocked()
    )
  );

  readonly dataForSave$ = this.shouldSave$.pipe(
    map((wpm) => {
      return {
        wpm: wpm,
        bookId: this.bookService.currentBookId(),
        exerciseNumber: this.currentExerciseService.exerciseNumber(),
        lastSegmentNumber: this.bookService.currentSegment()?.number || 1,
      };
    })
  );
}
