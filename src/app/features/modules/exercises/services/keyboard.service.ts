import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeyboardService {
  spacePress = new Subject<boolean>();

  constructor() {
    fromEvent<KeyboardEvent>(document, 'keypress').subscribe((e: KeyboardEvent) => {
      if(e.key === ' ') {
        this.spacePress.next(true);
      }
    })
  }
}
