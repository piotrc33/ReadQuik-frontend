import { Injectable, WritableSignal, signal } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ResultsService } from 'src/app/services/results.service';
import { calculateSpeed } from 'src/app/utils/utils';
import { BookService } from '../../library/services/book.service';
import { ExercisesProgressStateService } from '../../../services/exercises-progress-state.service';
import { ExerciseModeT } from '../model/exercise-mode.type';
import { ExercisesHttpService } from './exercises-http.service';
import { TextService } from './text.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class ExercisesStateService {
  readonly next$ = new Subject<void>();
  readonly exit$ = new Subject<void>();

  private _started: boolean = false;
  phraseNumber: WritableSignal<number> = signal(0);
  lastPracticed: number = 1;
  exerciseMode: ExerciseModeT = 'manual';
  progressPercent: number = 0;
  currentExercise$ = new BehaviorSubject<number>(1);

  pageYPosition: number = 0;

  panelContentElement?: HTMLElement;
  activeElement?: HTMLElement;

  startTime!: number;

  constructor(
    readonly text: TextService,
    private exHttpService: ExercisesHttpService,
    readonly bookService: BookService,
    private resultsService: ResultsService,
    private progressService: ExercisesProgressStateService,
    private readonly cookieService: CookieService,
    private readonly router: Router
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
      this.currentExercise$.value &&
      this.progressService.currentExerciseUnlocked$.value
    ) {
      this.exHttpService
        .saveResult(speed, this.currentExercise$.value, bookId)
        .subscribe();

      this.exHttpService
        .updateExercisesProgress$(this.currentExercise$.value)
        .subscribe((data) => {
          this.progressService.next(data);
          const currentExerciseProgress = data.find(
            (el) => el.exerciseNumber === this.currentExercise$.value
          );
          if (currentExerciseProgress?.repetitions === 0) {
            this.cookieService.delete(
              `instruction${this.currentExercise$.value + 1}Opened`
            );
            this.router.navigate([
              `/app/exercises/${this.currentExercise$.value + 1}`,
            ]);
          }
        });

      const currentSegment = this.bookService.currentSegment();
      if (currentSegment) {
        this.bookService
          .updateBookProgress(bookId, currentSegment.number)
          .subscribe(() => {
            this.bookService.getNextReadingData(bookId);
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
