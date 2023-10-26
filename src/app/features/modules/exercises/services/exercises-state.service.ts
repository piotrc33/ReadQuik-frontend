import { Subject } from 'rxjs';
import { TextService } from './text.service';
import { Injectable } from '@angular/core';
import { ExerciseModeT } from '../model/exercise-mode.type';

@Injectable()
export class ExercisesStateService {
  next$ = new Subject<void>();
  exit$ = new Subject<void>();

  private _started: boolean = false;
  phraseNumber: number = 0;
  bookFragments: string[];
  wordFragments: string[];
  lastPracticed: number = 1;
  exerciseMode: ExerciseModeT = 'manual';

  bookText: string;

  pageYPosition: number = 0;

  panelContentElement?: HTMLElement;
  activeElement?: HTMLElement;

  constructor(private readonly text: TextService) {
    this.bookFragments = text.getBookFragments();
    this.wordFragments = text.getWordFragments();
    this.bookText = text.bookText;
  }

  get started(): boolean {
    return this._started;
  }

  get currentPhrase(): string {
    return this.wordFragments[this.phraseNumber];
  }

  private set started(val: boolean) {
    this._started = val;
  }

  start(): void {
    this.started = true;
  }

  end(): void {
    this.started = false;
  }

  get finished(): boolean {
    return this.phraseNumber === this.wordFragments.length;
  }

  nextFragment(): void {
    this.phraseNumber++;
  }
}
