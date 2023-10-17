import { TextService } from './text.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ExercisesStateService {
  private _started: boolean = false;
  phraseNumber: number = 0;
  bookFragments: string[];
  lastPracticed: number = 1;

  constructor(private readonly text: TextService) {
    this.bookFragments = text.bookFragments;
  }

  get started(): boolean {
    return this._started;
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
    return this.phraseNumber === this.bookFragments.length;
  }

  nextFragment(): void {
    this.phraseNumber++;
  }
}
