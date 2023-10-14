import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, filter, fromEvent, tap } from 'rxjs';

@Injectable()
export class KeyboardService {
  private keyDown$ = fromEvent<KeyboardEvent>(document, 'keydown');

  forwardingPress$ = this.keyDown$.pipe(
    filter(
      (e: KeyboardEvent) =>
        e.key === ' ' || e.key === 'ArrowRight' || e.key === 'ArrowDown'
    ),
    tap(() => console.log('forwarding tap run :)'))
  );

  exitPress$ = this.keyDown$.pipe(
    filter(
      (e: KeyboardEvent) =>
        e.key === 'Escape'
    ),
    tap(() => console.log('exit tap run :O'))
  );

}
