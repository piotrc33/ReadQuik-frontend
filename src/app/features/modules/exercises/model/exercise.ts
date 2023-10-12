import { Injectable, OnDestroy } from "@angular/core";
import { TextService } from "../services/text.service";
import { Subscription } from "rxjs";
import { KeyboardService } from "../services/keyboard.service";

@Injectable()
export abstract class Exercise implements OnDestroy {
  phraseNumber: number = 0;
  bookFragments: string[];
  keyboardSubscription: Subscription;

  constructor(textService: TextService, keyService: KeyboardService) {
    this.bookFragments = textService.bookFragments;
    this.keyboardSubscription = keyService.forwardingPress.subscribe(
      () => {
        this.handleForwardingKey();
      }
    );
  }

  ngOnDestroy(): void {
    this.keyboardSubscription.unsubscribe();
  }

  get finished(): boolean {
    return this.phraseNumber === this.bookFragments.length;
  }

  abstract nextFragment(): void;

  abstract handleForwardingKey(): void;
}