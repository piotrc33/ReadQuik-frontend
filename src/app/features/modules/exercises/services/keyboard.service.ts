import { Injectable } from '@angular/core';
import { filter, fromEvent } from 'rxjs';
import { ExercisesStateService } from './exercises-state.service';

@Injectable()
export class KeyboardService {
  private keyDown$ = fromEvent<KeyboardEvent>(document, 'keydown');

  constructor() {}

  forwardingPress$ = this.keyDown$.pipe(
    filter(
      (e: KeyboardEvent) =>
        e.key === ' ' || e.key === 'ArrowRight' || e.key === 'ArrowDown'
    ),
  );

  exitPress$ = this.keyDown$.pipe(
    filter(
      (e: KeyboardEvent) =>
        e.key === 'Escape'
    ),
  );

}
