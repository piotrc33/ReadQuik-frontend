import { Injectable, WritableSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, firstValueFrom } from 'rxjs';
import { ReadingDataService } from 'src/app/shared/services/reading-data.service';
import { ResultsService } from 'src/app/shared/services/results.service';
import { calculateSpeed } from 'src/app/utils/utils';
import { BookService } from '../../library/services/book.service';
import { ExerciseModeT } from '../model/exercise-mode.type';
import { CurrentExerciseService } from './../../../shared/services/current-exercise.service';
import { ExercisesHttpService } from './exercises-http.service';
import { TextService } from './text.service';
import { ExercisesProgressStateService } from 'src/app/shared/services/exercises-progress-state.service';

@Injectable()
export class ExercisesStateService {
  readonly next$ = new Subject<void>();
  readonly exit$ = new Subject<void>();

  private _started: boolean = false;
  phraseNumber: WritableSignal<number> = signal(0);
  lastPracticed: number = 1;
  exerciseMode: ExerciseModeT = 'manual';
  progressPercent: number = 0;

  pageYPosition: number = 0;

  panelContentElement?: HTMLElement;
  activeElement?: HTMLElement;

  startTime!: number;

  constructor(
    readonly text: TextService,
    private readonly exHttpService: ExercisesHttpService,
    private readonly bookService: BookService,
    private readonly resultsService: ResultsService,
    private readonly progressService: ExercisesProgressStateService,
    private readonly cookieService: CookieService,
    private readonly router: Router,
    private readonly readingDataService: ReadingDataService,
    private readonly currentExerciseService: CurrentExerciseService
  ) {}

  get started(): boolean {
    return this._started;
  }

  private set started(val: boolean) {
    this._started = val;
  }

  get finished(): boolean {
    return this.phraseNumber() === this.bookService.wordPhrases().length;
  }

  start(): void {
    this.started = true;
    this.startTime = Date.now();
  }

  end(): void {
    this.started = false;
  }

  finish(): void {
    this.end();
    const speed = calculateSpeed(
      this.startTime,
      this.bookService.wordPhrases()
    );

    if (speed > 1000) return;

    const bookId = this.bookService.currentBookId();
    if (
      this.currentExerciseService.currentExercise$.value 
      &&
      this.progressService.currentExerciseUnlocked$.value
    ) {
      this.exHttpService
        .saveResult(speed, this.currentExerciseService.currentExercise$.value, bookId)
        .subscribe();

      this.exHttpService
        .updateExercisesProgress$(this.currentExerciseService.currentExercise$.value)
        .subscribe((data) => {
          const currentExerciseProgress = data.find(
            (el) => el.exerciseNumber === this.currentExerciseService.currentExercise$.value
          );
          if (currentExerciseProgress?.repetitions === 0) {
            this.cookieService.delete(
              `instruction${this.currentExerciseService.currentExercise$.value + 1}Opened`
            );
            this.router.navigate([
              `/app/exercises/${this.currentExerciseService.currentExercise$.value + 1}`,
            ]);
          }
        });

      const currentSegment = this.bookService.currentSegment();
      if (currentSegment) {
        firstValueFrom(
          this.bookService.updateBookProgress(bookId, currentSegment.number)
        ).then(() => {
          this.readingDataService.nextReadingDataForBookAction$.next(bookId);
        });
      }
      this.resultsService.updateRecentResults();
    }
  }

  nextFragment(): void {
    this.phraseNumber.update((val) => val + 1);
    const wordPhrases = this.bookService.wordPhrases();

    this.progressPercent = Math.round(
      (this.phraseNumber() / wordPhrases.length) * 100
    );
  }
}
