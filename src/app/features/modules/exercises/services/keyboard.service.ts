import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, fromEvent } from 'rxjs';

@Injectable()
export class KeyboardService {
  forwardingPress = new Subject<boolean>();

  constructor() {
    fromEvent<KeyboardEvent>(document, 'keydown').subscribe(
      (e: KeyboardEvent) => {
        if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          this.forwardingPress.next(true);
        }
      }
    );
  }
}
