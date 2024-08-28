import { Injectable, Signal, computed, inject } from '@angular/core';
import { ReadingDataStateService } from 'src/app/shared/services/reading-data/reading-data-state.service';
import { TextService } from './text.service';

@Injectable({
  providedIn: 'root',
})
export class PhrasesStateService {
  readonly #readingDataState = inject(ReadingDataStateService);
  readonly #textService = inject(TextService);

  readonly phrasesWithNewlines: Signal<string[]> = computed(() => {
    return this.#textService.getFragmentsWithNewlines(
      this.#readingDataState.segmentText()
    );
  });

  readonly wordPhrases: Signal<string[]> = computed(() =>
    this.#textService.removeNewlines(this.phrasesWithNewlines())
  );
}
