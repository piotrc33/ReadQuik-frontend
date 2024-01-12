import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ResultsService } from 'src/app/features/services/results.service';
import { calculateSpeed } from 'src/app/utils/utils';
import { BookService } from '../../library/services/book.service';
import { ExercisesProgressStateService } from '../../services/exercises-progress-state.service';
import { ExerciseModeT } from '../model/exercise-mode.type';
import { ExercisesHttpService } from './exercises-http.service';
import { TextService } from './text.service';

@Injectable()
export class ExercisesStateService {
  readonly next$ = new Subject<void>();
  readonly exit$ = new Subject<void>();

  private _started: boolean = false;
  phraseNumber: number = 0;
  lastPracticed: number = 1;
  exerciseMode: ExerciseModeT = 'manual';
  progressPercent: number = 0;
  currentExercise$ = new BehaviorSubject<number>(1);

  pageYPosition: number = 0;

  panelContentElement?: HTMLElement;
  activeElement?: HTMLElement;

  startTime!: number;
  speed?: number;

  constructor(
    readonly text: TextService,
    private exHttpService: ExercisesHttpService,
    readonly bookService: BookService,
    private resultsService: ResultsService,
    private progressService: ExercisesProgressStateService
  ) {}

  get started(): boolean {
    return this._started;
  }

  get currentPhrase(): string {
    return this.bookService.wordPhrases[this.phraseNumber];
  }

  private set started(val: boolean) {
    this._started = val;
  }

  get finished(): boolean {
    return this.phraseNumber === this.bookService.wordPhrases.length;
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
    this.speed = calculateSpeed(
      this.startTime,
      this.bookService.wordPhrases
    );
    console.log(this.speed, 'wpm');

    const bookId = this.bookService.currentBookId();
    if (this.currentExercise$.value) {
      this.exHttpService
        .saveResult(this.speed, this.currentExercise$.value, bookId)
        .subscribe(console.log);

        this.exHttpService
        .updateExercisesProgress$(this.currentExercise$.value)
        .subscribe(data => this.progressService.next(data));
      if (this.bookService.currentSegment) {
        this.bookService
          .updateBookProgress(bookId, this.bookService.currentSegment.number)
          .subscribe(() => {
            this.bookService.getNextReadingData(bookId);
          });
      }
      this.resultsService.updateRecentResults();
    }
  }

  nextFragment(): void {
    this.phraseNumber++;
    this.progressPercent = Math.round((this.phraseNumber / this.bookService.wordPhrases.length) * 100); 
  }
}
