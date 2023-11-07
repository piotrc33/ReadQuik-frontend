import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ExerciseModeT } from '../model/exercise-mode.type';
import { ExercisesHttpService } from './exercises-http.service';
import { TextService } from './text.service';

@Injectable()
export class ExercisesStateService {
  next$ = new Subject<void>();
  exit$ = new Subject<void>();

  private _started: boolean = false;
  phraseNumber: number = 0;
  bookFragmentsWithNewlines: string[] = [];
  wordFragments: string[] = [];
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
    private exHttpService: ExercisesHttpService
  ) {}

  get started(): boolean {
    return this._started;
  }

  get currentPhrase(): string {
    return this.wordFragments[this.phraseNumber];
  }

  private set started(val: boolean) {
    this._started = val;
  }

  get finished(): boolean {
    return this.phraseNumber === this.wordFragments.length;
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
    this.speed = this.calculateSpeed(this.startTime, this.wordFragments);
    console.log(this.speed, 'wpm');
    if (this.currentExercise) {
      this.exHttpService
        .saveResult(this.speed, this.currentExercise)
        .subscribe(console.log);
    }
  }

  calculateSpeed(startTime: number, wordFragments: string[]): number {
    const totalCharacters: number = wordFragments.reduce(
      (total, currentWord) => total + currentWord.length,
      0
    );
    const elapsedTimeMin = (Date.now() - startTime) / (1000 * 60);
    return Math.floor(totalCharacters / 5.5 / elapsedTimeMin);
  }

  nextFragment(): void {
    this.phraseNumber++;
  }
}
