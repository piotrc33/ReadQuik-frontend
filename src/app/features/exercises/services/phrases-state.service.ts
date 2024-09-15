import { Injectable, Signal, computed, inject } from '@angular/core';
import { ReadingDataStateService } from 'src/app/shared/services/reading-data/reading-data-state.service';
import { TextUtils } from 'src/app/utils/text.utils';

@Injectable({
  providedIn: 'root',
})
export class PhrasesStateService {
  readonly #readingDataState = inject(ReadingDataStateService);

  readonly phrasesWithNewlines: Signal<string[]> = computed(() => {
    return TextUtils.getFragmentsWithNewlines(
      this.#readingDataState.segmentText()
    );
  });

  readonly wordPhrases: Signal<string[]> = computed(() =>
    TextUtils.removeNewlines(this.phrasesWithNewlines())
  );
}
