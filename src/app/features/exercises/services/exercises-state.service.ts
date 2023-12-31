import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ResultsService } from 'src/app/features/services/results.service';
import { calculateSpeed } from 'src/app/utils/utils';
import { BookService } from '../../library/services/book.service';
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
  currentExercise?: number;

  pageYPosition: number = 0;

  panelContentElement?: HTMLElement;
  activeElement?: HTMLElement;

  startTime!: number;
  speed?: number;

  constructor(
    readonly text: TextService,
    private exHttpService: ExercisesHttpService,
    readonly bookService: BookService,
    private resultsService: ResultsService
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
    if (this.currentExercise) {
      this.exHttpService
        .saveResult(this.speed, this.currentExercise, bookId)
        .subscribe(console.log);
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
  }
}
