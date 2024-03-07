import { Injectable } from '@angular/core';
import { filter, fromEvent, map } from 'rxjs';

@Injectable()
export class KeyboardService {
  private keyDown$ = fromEvent<KeyboardEvent>(document, 'keydown');

  forwardingPress$ = this.keyDown$.pipe(
    filter(
      (e: KeyboardEvent) =>
        e.key === ' ' || e.key === 'ArrowRight' || e.key === 'ArrowDown'
    ),
    map(() => undefined)
  );

  exitPress$ = this.keyDown$.pipe(
    filter(
      (e: KeyboardEvent) =>
        e.key === 'Escape'
    ),
  );

}
