import { TextService } from './text.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ExercisesStateService {
  started: boolean = false;
  phraseNumber: number = 0;
  bookFragments: string[];

  constructor(private readonly text: TextService) {
    this.bookFragments = text.bookFragments;
  }

  get finished(): boolean {
    return this.phraseNumber === this.bookFragments.length;
  }
}
